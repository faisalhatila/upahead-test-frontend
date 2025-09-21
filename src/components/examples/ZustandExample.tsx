import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';

// Example component showing different ways to use Zustand stores
export function ZustandExample() {
  // Method 1: Using individual stores
  const { user, loading } = useAuthStore();
  const { tasks, addTask } = useTaskStore();

  // Method 2: Using the combined hook
  const { isAuthenticated, userTasks, completedTasks } = useAppState();

  const handleAddSampleTask = () => {
    addTask({
      title: 'Sample Task from Zustand',
      description: 'This task was added using Zustand store',
      completed: false,
      important: false,
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Zustand Store Examples</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Auth State:</h4>
          <p>User: {user?.displayName || 'Not logged in'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        </div>

        <div>
          <h4 className="font-medium">Task State:</h4>
          <p>Total Tasks: {tasks.length}</p>
          <p>User Tasks: {userTasks.length}</p>
          <p>Completed Tasks: {completedTasks.length}</p>
        </div>

        <Button onClick={handleAddSampleTask}>
          Add Sample Task
        </Button>
      </div>
    </div>
  );
}
