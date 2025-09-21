import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, Timestamp, limit, startAfter, DocumentSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface FirestoreTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: Timestamp;
  issueDate?: Timestamp;
  dueDate?: Timestamp;
  completed: boolean;
  important?: boolean;
  subject?: string;
  tags?: string[];
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: number;
  issueDate?: number;
  dueDate?: number;
  completed: boolean;
  important?: boolean;
  subject?: string;
  tags?: string[];
}

export const convertFirestoreTaskToTask = (firestoreTask: FirestoreTask): Task => ({
  id: firestoreTask.id,
  userId: firestoreTask.userId,
  title: firestoreTask.title,
  description: firestoreTask.description,
  createdAt: firestoreTask.createdAt.toMillis(),
  issueDate: firestoreTask.issueDate?.toMillis(),
  dueDate: firestoreTask.dueDate?.toMillis(),
  completed: firestoreTask.completed,
  important: firestoreTask.important || false,
  subject: firestoreTask.subject,
  tags: firestoreTask.tags || []
});

export interface PaginatedTasksResult {
  tasks: Task[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}

export const getTasksFromFirestore = async (
  userId: string, 
  pageSize: number = 10,
  lastDoc?: DocumentSnapshot | null
): Promise<PaginatedTasksResult> => {
  if (!db) {
    console.error('Firestore not initialized');
    return { tasks: [], lastDoc: null, hasMore: false };
  }

  try {
    console.log('Fetching tasks from Firestore for user:', userId, 'pageSize:', pageSize);
    const tasksRef = collection(db, 'tasks');
    
    // Build query with pagination
    let q = query(
      tasksRef,
      where('userId', '==', userId),
      limit(pageSize + 1) // Fetch one extra to check if there are more
    );

    if (lastDoc) {
      q = query(
        tasksRef,
        where('userId', '==', userId),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    let newLastDoc: DocumentSnapshot | null = null;
    
    querySnapshot.docs.forEach((doc, index: number) => {
      if (index < pageSize) {
        const data = doc.data() as Omit<FirestoreTask, 'id'>;
        const task: FirestoreTask = {
          id: doc.id,
          ...data
        };
        tasks.push(convertFirestoreTaskToTask(task));
        newLastDoc = doc;
      }
    });
    
    // Check if there are more documents
    const hasMore = querySnapshot.docs.length > pageSize;
    
    // Sort tasks: Important first, then by createdAt descending
    tasks.sort((a, b) => {
      // Important tasks come first
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      
      // Within same importance level, sort by createdAt descending
      return b.createdAt - a.createdAt;
    });
    
    console.log('Fetched tasks from Firestore:', { 
      count: tasks.length, 
      hasMore, 
      importantCount: tasks.filter(t => t.important).length 
    });
    
    return {
      tasks,
      lastDoc: newLastDoc,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching tasks from Firestore:', error);
    return { tasks: [], lastDoc: null, hasMore: false };
  }
};

// Add a new task to Firestore
export const addTaskToFirestore = async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<string> => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }

  try {
    const tasksRef = collection(db, 'tasks');
    const firestoreTask = {
      ...taskData,
      createdAt: Timestamp.now(),
      issueDate: taskData.issueDate ? Timestamp.fromMillis(taskData.issueDate) : undefined,
      dueDate: taskData.dueDate ? Timestamp.fromMillis(taskData.dueDate) : undefined,
    };

    const docRef = await addDoc(tasksRef, firestoreTask);
    console.log('Task added to Firestore with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding task to Firestore:', error);
    throw error;
  }
};

// Update a task in Firestore
export const updateTaskInFirestore = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }

  try {
    const taskRef = doc(db, 'tasks', taskId);
    const firestoreUpdates: any = { ...updates };
    
    // Convert timestamps if present
    if (updates.issueDate !== undefined) {
      firestoreUpdates.issueDate = updates.issueDate ? Timestamp.fromMillis(updates.issueDate) : null;
    }
    if (updates.dueDate !== undefined) {
      firestoreUpdates.dueDate = updates.dueDate ? Timestamp.fromMillis(updates.dueDate) : null;
    }
    
    // Remove fields that shouldn't be updated
    delete firestoreUpdates.id;
    delete firestoreUpdates.userId;
    delete firestoreUpdates.createdAt;

    await updateDoc(taskRef, firestoreUpdates);
    console.log('Task updated in Firestore:', taskId);
  } catch (error) {
    console.error('Error updating task in Firestore:', error);
    throw error;
  }
};

// Delete a task from Firestore
export const deleteTaskFromFirestore = async (taskId: string): Promise<void> => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }

  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
    console.log('Task deleted from Firestore:', taskId);
  } catch (error) {
    console.error('Error deleting task from Firestore:', error);
    throw error;
  }
};
