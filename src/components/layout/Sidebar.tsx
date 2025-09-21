import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BulkImportTasks } from '@/components/tasks/BulkImportTasks';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Filter, 
  Home, 
  Star, 
  Tag,
  TrendingUp,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Today', icon: Home, href: '/', current: true, count: 3 },
  // { name: 'Upcoming', icon: Calendar, href: '/upcoming', current: false, count: 7 },
  // { name: 'Important', icon: Star, href: '/important', current: false, count: 2 },
  // { name: 'Completed', icon: CheckSquare, href: '/completed', current: false, count: 12 },
];

const filters = [
  { name: 'Overdue', icon: Clock, href: '#', color: 'text-error' },
  { name: 'This Week', icon: TrendingUp, href: '#', color: 'text-accent' },
  { name: 'No Due Date', icon: Filter, href: '#', color: 'text-gray-500' },
];

const tags = [
  { name: 'Work', color: 'bg-primary/10 text-primary' },
  { name: 'Personal', color: 'bg-accent/10 text-accent' },
  { name: 'Shopping', color: 'bg-cta/10 text-cta-foreground' },
  { name: 'Health', color: 'bg-success/10 text-success' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-gray-200 transition-transform duration-normal md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
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
            <Button variant="ghost" size="icon-sm" onClick={onToggle}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            {/* Main Navigation */}
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      item.current
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.name}</span>
                    {item.count > 0 && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        item.current
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-200 text-gray-600"
                      )}>
                        {item.count}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Filters */}
            <div>
              <h3 className="text-caption text-gray-500 mb-3">Filters</h3>
              <nav className="space-y-1">
                {filters.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.name}
                      variant='outline'
                      // href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      disabled
                    >
                      <Icon className={cn("w-4 h-4", item.color)} />
                      <span>{item.name}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-caption text-gray-500">Tags</h3>
                <Button variant="ghost" size="icon-sm" className="w-5 h-5 text-gray-400 hover:text-gray-600">
                  <Tag className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div
                    key={tag.name}
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity",
                      tag.color
                    )}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Import Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                AI-Powered Import
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Upload CSV/Excel files to import multiple tasks
              </p>
              <BulkImportTasks />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}