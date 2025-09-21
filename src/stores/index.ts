// Export all stores from a central location
export { useAuthStore } from './authStore';
export { useTaskStore } from './taskStore';
export type { Task } from './taskStore';

// Combined store hook for convenience
import { useAuthStore } from './authStore';
import { useTaskStore } from './taskStore';

export const useAppStore = () => {
  const auth = useAuthStore();
  const tasks = useTaskStore();

  return {
    auth,
    tasks,
  };
};
