import { create } from 'zustand';
import { getTasksFromFirestore, PaginatedTasksResult, addTaskToFirestore, updateTaskInFirestore, deleteTaskFromFirestore } from '@/lib/firestore-direct';
import { DocumentSnapshot } from 'firebase/firestore';

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

interface TaskState {
  tasks: Task[];
  loading: boolean;
  currentUserId: string | null;
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
  pageSize: number;
}

interface TaskActions {
  setCurrentUser: (userId: string | null) => void;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  clearTasks: () => void;
  refreshTasks: () => Promise<void>;
  loadMoreTasks: () => Promise<void>;
  getTasksByUser: (userId: string) => Task[];
  getTasksByFilter: (filter: 'all' | 'upcoming' | 'important' | 'completed') => Task[];
}

type TaskStore = TaskState & TaskActions;

export const useTaskStore = create<TaskStore>()((set, get) => ({
      // State
      tasks: [],
      loading: false,
      currentUserId: null,
      lastDoc: null,
      hasMore: false,
      pageSize: 10,

      // Actions
      setCurrentUser: async (userId) => {
        const { currentUserId } = get();
        console.log('TaskStore setCurrentUser called:', { userId, currentUserId });
        set({ currentUserId: userId });
        
        // Clear tasks when user changes
        if (userId !== currentUserId) {
          console.log('User changed, clearing tasks and loading new ones');
          set({ tasks: [], lastDoc: null, hasMore: false });
          
          // Load tasks from Firestore for new user
          if (userId) {
            try {
              set({ loading: true });
              console.log('Loading tasks from Firestore for user:', userId);
              const { pageSize } = get();
              const result = await getTasksFromFirestore(userId, pageSize);
              console.log('Loaded tasks from Firestore:', result);
              set({ 
                tasks: result.tasks, 
                lastDoc: result.lastDoc, 
                hasMore: result.hasMore,
                loading: false 
              });
            } catch (error) {
              console.error('Error loading tasks from Firestore:', error);
              set({ loading: false });
            }
          }
        }
        console.log('Current user set to:', userId);
      },

      addTask: async (taskData) => {
        const { currentUserId } = get();
        if (!currentUserId) {
          throw new Error('No user logged in');
        }

        try {
          const taskWithUser = {
            ...taskData,
            userId: currentUserId,
          };
          await addTaskToFirestore(taskWithUser);
          console.log('Task added to Firestore, refreshing list');
          await get().refreshTasks();
        } catch (error) {
          console.error('Error adding task:', error);
          throw error;
        }
      },

      updateTask: async (id, updates) => {
        try {
          await updateTaskInFirestore(id, updates);
          console.log('Task updated in Firestore, refreshing list');
          await get().refreshTasks();
        } catch (error) {
          console.error('Error updating task:', error);
          throw error;
        }
      },

      deleteTask: async (id) => {
        try {
          await deleteTaskFromFirestore(id);
          console.log('Task deleted from Firestore, refreshing list');
          await get().refreshTasks();
        } catch (error) {
          console.error('Error deleting task:', error);
          throw error;
        }
      },

      toggleTask: async (id) => {
        const { tasks } = get();
        const task = tasks.find(t => t.id === id);
        if (!task) {
          throw new Error('Task not found');
        }

        try {
          await updateTaskInFirestore(id, { completed: !task.completed });
          console.log('Task toggled in Firestore, refreshing list');
          await get().refreshTasks();
        } catch (error) {
          console.error('Error toggling task:', error);
          throw error;
        }
      },

      setTasks: (tasks) => set({ tasks }),
      setLoading: (loading) => set({ loading }),
      clearTasks: () => set({ tasks: [] }),

      refreshTasks: async () => {
        const { currentUserId, pageSize } = get();
        if (!currentUserId) return;

        try {
          set({ loading: true });
          console.log('Refreshing tasks from Firestore for user:', currentUserId);
          const result = await getTasksFromFirestore(currentUserId, pageSize);
          console.log('Tasks from Firestore:', result);
          set({ 
            tasks: result.tasks, 
            lastDoc: result.lastDoc, 
            hasMore: result.hasMore,
            loading: false 
          });
        } catch (error) {
          console.error('Error refreshing tasks from Firestore:', error);
          set({ loading: false });
        }
      },

      loadMoreTasks: async () => {
        const { currentUserId, lastDoc, hasMore, pageSize, tasks } = get();
        if (!currentUserId || !hasMore || !lastDoc) return;

        try {
          set({ loading: true });
          console.log('Loading more tasks from Firestore for user:', currentUserId);
          const result = await getTasksFromFirestore(currentUserId, pageSize, lastDoc);
          console.log('More tasks from Firestore:', result);
          
          // Append new tasks to existing ones
          set({ 
            tasks: [...tasks, ...result.tasks], 
            lastDoc: result.lastDoc, 
            hasMore: result.hasMore,
            loading: false 
          });
        } catch (error) {
          console.error('Error loading more tasks from Firestore:', error);
          set({ loading: false });
        }
      },

      getTasksByUser: (userId) => {
        return get().tasks.filter((task) => task.userId === userId);
      },

      getTasksByFilter: (filter) => {
        const { tasks, currentUserId } = get();
        const userTasks = tasks.filter((task) => task.userId === currentUserId);

        switch (filter) {
          case 'completed':
            return userTasks.filter((task) => task.completed);
          case 'important':
            return userTasks.filter((task) => task.important && !task.completed);
          case 'upcoming':
            const now = Date.now();
            return userTasks.filter(
              (task) =>
                !task.completed &&
                task.dueDate &&
                task.dueDate > now &&
                task.dueDate <= now + 7 * 24 * 60 * 60 * 1000 // Next 7 days
            );
          case 'all':
          default:
            return userTasks;
        }
      },
}));
