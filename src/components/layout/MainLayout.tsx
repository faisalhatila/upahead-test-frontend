import { useState } from 'react';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { TaskList } from '../tasks/TaskList';
import { QuickAddTask } from '../tasks/QuickAddTask';
import { TaskFocusProvider } from '../tasks/TaskFocusContext';
import { User } from '@/lib/auth';

interface MainLayoutProps {
  defaultFilter?: 'all' | 'upcoming' | 'important' | 'completed';
  user: User | null;
  onLogout: () => void;
}

export function MainLayout({ defaultFilter, user, onLogout }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AppHeader 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          user={user}
          onLogout={onLogout}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <TaskFocusProvider>
              {/* Quick Add Task */}
              <div className="mb-6">
                <QuickAddTask />
              </div>
              
              {/* Task List */}
              <TaskList defaultFilter={defaultFilter} />
            </TaskFocusProvider>
          </div>
        </main>
      </div>
    </div>
  );
}