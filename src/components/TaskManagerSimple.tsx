import { useState, useEffect } from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { LoginScreen } from './auth/LoginScreen';
import { MainLayout } from './layout/MainLayout';
import { TaskProvider } from './tasks/TaskProvider';
import { User } from '@/lib/auth';

interface TaskManagerProps {
  defaultFilter?: 'all' | 'upcoming' | 'important' | 'completed';
}

export function TaskManagerSimple({ defaultFilter = 'all' }: TaskManagerProps = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate authentication state check
  useEffect(() => {
    const checkAuthState = () => {
      const savedUser = localStorage.getItem('taskManager_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('taskManager_user');
        }
      }
      setLoading(false);
    };

    checkAuthState();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('taskManager_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      // Try to sign out from Firebase if available
      const { signOutUser } = await import('@/lib/auth');
      await signOutUser();
    } catch (error) {
      // Ignore errors in demo mode
      console.log('Demo mode: Firebase sign out not available');
    }
    
    setUser(null);
    localStorage.removeItem('taskManager_user');
    localStorage.removeItem('taskManager_tasks');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="spinner w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <AuthProvider user={user} onLogin={handleLogin} onLogout={handleLogout}>
      {user ? (
        <TaskProvider userId={user.uid}>
          <MainLayout defaultFilter={defaultFilter} />
        </TaskProvider>
      ) : (
        <LoginScreen />
      )}
    </AuthProvider>
  );
}
