import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTaskStore, Task } from '@/stores/taskStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  Sparkles, 
  Star, 
  Tag,
  Trash2,
  Edit3
} from 'lucide-react';
import { AIPopup } from './AIPopup';

interface TaskItemProps {
  task: Task;
  style?: React.CSSProperties;
  className?: string;
}

export function TaskItem({ task, style, className }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskStore();
  const [showAI, setShowAI] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = async () => {
    try {
      await toggleTask(task.id);
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed!');
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        toast.success('Task deleted successfully');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task. Please try again.');
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const isOverdue = task.dueDate && task.dueDate < Date.now() && !task.completed;

  return (
    <>
      <div
        style={style}
        className={cn(
          "group bg-surface border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-soft transition-all duration-normal",
          task.completed && "opacity-75",
          isOverdue && "border-error/30 bg-error/5",
          task.important && !task.completed && "border-yellow-300 bg-yellow-50/50",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={cn(
              "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-fast task-checkbox",
              task.completed
                ? "bg-success border-success text-white"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            )}
          >
            {task.completed && (
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={cn(
                      "text-body font-medium text-gray-900 transition-all duration-normal",
                      task.completed && "line-through text-gray-500"
                    )}
                  >
                    {task.title}
                  </h3>
                  {task.important && !task.completed && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                {task.description && (
                  <p
                    className={cn(
                      "mt-1 text-body-sm text-gray-600 transition-all duration-normal",
                      task.completed && "line-through text-gray-400"
                    )}
                  >
                    {task.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className={cn(
                "flex items-center gap-1 transition-opacity duration-normal",
                isHovered ? "opacity-100" : "opacity-0"
              )}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowAI(true)}
                  className="text-gray-400 hover:text-primary"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Meta Information */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-error"
                )}>
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(task.createdAt)}</span>
              </div>

              {task.subject && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                    {task.subject}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Popup */}
      {showAI && (
        <AIPopup
          task={task}
          onClose={() => setShowAI(false)}
        />
      )}
    </>
  );
}