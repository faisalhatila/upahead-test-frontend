import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Menu, Bell, Search } from 'lucide-react';
import { User } from '@/lib/auth';

interface AppHeaderProps {
  onToggleSidebar: () => void;
  user: User | null;
  onLogout: () => void;
}

export function AppHeader({ onToggleSidebar, user, onLogout }: AppHeaderProps) {

  return (
    <header className="h-16 bg-surface border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden md:flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-heading text-gray-900">TaskFlow</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search - Desktop only */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-64">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none flex-1"
          />
          <kbd className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-cta rounded-full"></span>
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.photoURL}
            alt={user?.displayName || 'User'}
            name={user?.displayName}
            size="md"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-500 hover:text-gray-700"
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}