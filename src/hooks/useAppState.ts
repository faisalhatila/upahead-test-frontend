import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';

// Custom hook to access both auth and task stores
export const useAppState = () => {
  const auth = useAuthStore();
  const tasks = useTaskStore();

  return {
    // Auth state
    user: auth.user,
    isAuthenticated: !!auth.user,
    authLoading: auth.loading,
    signIn: auth.signIn,
    signOut: auth.signOut,

    // Task state
    tasks: tasks.tasks,
    taskLoading: tasks.loading,
    addTask: tasks.addTask,
    updateTask: tasks.updateTask,
    deleteTask: tasks.deleteTask,
    toggleTask: tasks.toggleTask,
    getTasksByFilter: tasks.getTasksByFilter,

    // Combined state
    userTasks: tasks.getTasksByUser(auth.user?.uid || ''),
    completedTasks: tasks.getTasksByFilter('completed'),
    importantTasks: tasks.getTasksByFilter('important'),
    upcomingTasks: tasks.getTasksByFilter('upcoming'),
  };
};
