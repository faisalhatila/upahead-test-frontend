import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | null>(null);

interface TaskProviderProps {
  userId: string;
  children: ReactNode;
}

export function TaskProvider({ userId, children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedTasks = localStorage.getItem('taskManager_tasks');
        if (savedTasks) {
          const allTasks = JSON.parse(savedTasks);
          const userTasks = allTasks.filter((task: Task) => task.userId === userId);
          setTasks(userTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [userId]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!loading) {
      try {
        const savedTasks = localStorage.getItem('taskManager_tasks');
        const allTasks = savedTasks ? JSON.parse(savedTasks) : [];
        
        // Remove old tasks for this user and add current tasks
        const otherUserTasks = allTasks.filter((task: Task) => task.userId !== userId);
        const updatedTasks = [...otherUserTasks, ...tasks];
        
        localStorage.setItem('taskManager_tasks', JSON.stringify(updatedTasks));
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    }
  }, [tasks, userId, loading]);

  const addTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    const newTask: Task = {
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      userId,
      createdAt: Date.now(),
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    loading,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}