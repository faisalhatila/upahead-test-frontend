import { useState, useEffect } from 'react';
import { LoginScreen } from './auth/LoginScreen';
import { MainLayout } from './layout/MainLayout';
import { User, signOutUser } from '@/lib/auth';
import { onAuthStateChange } from '@/lib/auth';
import { useTaskStore } from '@/stores/taskStore';

interface TaskManagerProps {
  defaultFilter?: 'all' | 'upcoming' | 'important' | 'completed';
}

function TaskManagerContent({ defaultFilter = 'all' }: TaskManagerProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentUser } = useTaskStore();

  useEffect(() => {
    console.log('TaskManagerFirebase: Setting up auth listener');
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      console.log('TaskManagerFirebase: Auth state changed:', firebaseUser);
      setUser(firebaseUser);
      setCurrentUser(firebaseUser?.uid || null);
      setLoading(false);
    });

    return () => {
      console.log('TaskManagerFirebase: Cleaning up auth listener');
      unsubscribe();
    };
  }, [setCurrentUser]);

  if (loading) {
    console.log('TaskManagerFirebase: Loading state - showing spinner');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="spinner w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    console.log('TaskManagerFirebase: No user - showing login screen');
    return <LoginScreen onLogin={(user) => setUser(user)} />;
  }

  console.log('TaskManagerFirebase: User authenticated - showing main layout', user);

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <MainLayout 
      defaultFilter={defaultFilter} 
      user={user}
      onLogout={handleLogout}
    />
  );
}

export function TaskManagerFirebase({ defaultFilter = 'all' }: TaskManagerProps = {}) {
  return <TaskManagerContent defaultFilter={defaultFilter} />;
}
