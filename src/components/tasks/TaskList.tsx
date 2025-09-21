import { useState } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';
import { Filter, SortAsc } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'dueDate' | 'issueDate';

interface TaskListProps {
  defaultFilter?: 'all' | 'upcoming' | 'important' | 'completed';
}

export function TaskList({ defaultFilter = 'all' }: TaskListProps = {}) {
  const { tasks, loading, hasMore, loadMoreTasks } = useTaskStore();
  const [filter, setFilter] = useState<FilterType>(
    defaultFilter === 'upcoming' ? 'all' : 
    defaultFilter === 'important' ? 'all' : 
    defaultFilter as FilterType
  );
  const [sort, setSort] = useState<SortType>('dueDate');

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  // Filter tasks based on page and filter
  const filteredTasks = tasks.filter(task => {
    // First apply page-specific filtering
    if (defaultFilter === 'upcoming') {
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      return task.dueDate && task.dueDate > now && task.dueDate <= now + oneWeek && !task.completed;
    }
    if (defaultFilter === 'important') {
      return task.important && !task.completed;
    }
    if (defaultFilter === 'completed') {
      return task.completed;
    }

    // Then apply filter-specific filtering
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  // Sort tasks - Important tasks always come first, then by selected sort criteria
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First priority: Important tasks come first
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    
    // If both are important or both are not important, sort by selected criteria
    switch (sort) {
      case 'dueDate':
        // Sort by nearest due date
        if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt; // fallback to newest
        if (!a.dueDate) return 1; // tasks without due date go to bottom
        if (!b.dueDate) return -1; // tasks without due date go to bottom
        return a.dueDate - b.dueDate; // nearest due date first
      
      case 'issueDate':
        // Sort by earliest issue date
        if (!a.issueDate && !b.issueDate) return b.createdAt - a.createdAt; // fallback to newest
        if (!a.issueDate) return 1; // tasks without issue date go to bottom
        if (!b.issueDate) return -1; // tasks without issue date go to bottom
        return a.issueDate - b.issueDate; // earliest issue date first
      
      default:
        return b.createdAt - a.createdAt; // fallback to newest
    }
  });

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-4">
      {/* Header with Stats and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-title text-gray-900">Tasks</h2>
          <div className="flex items-center gap-4 text-body-sm text-gray-600">
            <span>{activeCount} active</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full" />
            <span>{completedCount} completed</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Buttons - Commented out for now */}
          {/* <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(filterType)}
                className={filter === filterType ? 'shadow-none' : ''}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Button>
            ))}
          </div> */}

          {/* Sort Options */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {(['dueDate', 'issueDate'] as SortType[]).map((sortType) => (
              <Button
                key={sortType}
                variant={sort === sortType ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSort(sortType)}
                className={sort === sortType ? 'shadow-none' : ''}
              >
                {sortType === 'dueDate' ? 'Due Date' : 'Issue Date'}
              </Button>
            ))}
          </div>

          {/* Filter Button - Commented out for now */}
          {/* <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button> */}
        </div>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-heading text-gray-900 mb-2">No tasks found</h3>
          <p className="text-body-sm text-gray-600">
            No tasks match your current filter. Try adjusting your filters or add a new task.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map((task, index) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              style={{ animationDelay: `${index * 50}ms` }}
              className="task-enter"
            />
          ))}
          
          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={loadMoreTasks}
                disabled={loading}
                variant="outline"
                className="w-full max-w-xs"
              >
                {loading ? 'Loading...' : 'Load More Tasks'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}