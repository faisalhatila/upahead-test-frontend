import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CustomCalendar } from '@/components/ui/custom-calendar';
import { useTaskStore, Task } from '@/stores/taskStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Star, 
  Tag,
  Trash2,
  Edit3
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  style?: React.CSSProperties;
  className?: string;
}

export function TaskItem({ task, style, className }: TaskItemProps) {
  const { toggleTask, deleteTask, updateTask } = useTaskStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editIssueDate, setEditIssueDate] = useState<Date>(task.issueDate ? new Date(task.issueDate) : new Date());
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined);
  const [editImportant, setEditImportant] = useState(task.important || false);
  const [editErrors, setEditErrors] = useState<{[key: string]: string}>({});

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
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditIssueDate(task.issueDate ? new Date(task.issueDate) : new Date());
    setEditDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    setEditImportant(task.important || false);
    setEditErrors({});
  };

  const validateEditForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!editTitle.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!editIssueDate) {
      newErrors.issueDate = 'Issue date is required';
    } else if (editIssueDate > new Date()) {
      newErrors.issueDate = 'Issue date cannot be in the future';
    }

    if (!editDueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (editIssueDate && editDueDate <= editIssueDate) {
      newErrors.dueDate = 'Due date must be after issue date';
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearEditError = (field: string) => {
    if (editErrors[field]) {
      setEditErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      toast.error('Please fix the validation errors before saving.');
      return;
    }

    try {
      await updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        issueDate: editIssueDate.getTime(),
        dueDate: editDueDate?.getTime(),
        important: editImportant,
      });
      toast.success('Task updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditIssueDate(task.issueDate ? new Date(task.issueDate) : new Date());
    setEditDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    setEditImportant(task.important || false);
    setEditErrors({});
  };

  const handleEditIssueDateChange = (date: Date | undefined) => {
    if (date) {
      setEditIssueDate(date);
      clearEditError('issueDate');
      // If due date is before new issue date, clear it
      if (editDueDate && editDueDate <= date) {
        setEditDueDate(undefined);
        clearEditError('dueDate');
      }
    }
  };

  const handleEditDueDateChange = (date: Date | undefined) => {
    if (date) {
      setEditDueDate(date);
      clearEditError('dueDate');
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
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => {
                        setEditTitle(e.target.value);
                        clearEditError('title');
                      }}
                      className={cn(
                        "w-full px-2 py-1 text-body font-medium text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        editErrors.title && "border-red-500"
                      )}
                      placeholder="Task title"
                    />
                    {editErrors.title && (
                      <p className="text-xs text-red-500">{editErrors.title}</p>
                    )}
                    
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-2 py-1 text-body-sm text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Task description (optional)"
                      rows={2}
                    />

                    {/* Date Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Issue Date */}
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Issue Date *</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                editErrors.issueDate && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {format(editIssueDate, "MMM dd")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CustomCalendar
                              selected={editIssueDate}
                              onSelect={handleEditIssueDateChange}
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        {editErrors.issueDate && (
                          <p className="text-xs text-red-500 mt-1">{editErrors.issueDate}</p>
                        )}
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Due Date *</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!editIssueDate}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                editErrors.dueDate && "border-red-500",
                                !editIssueDate && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {editDueDate ? format(editDueDate, "MMM dd") : "Select"}
                            </Button>
                          </PopoverTrigger>
                          {editIssueDate && (
                            <PopoverContent className="w-auto p-0" align="start">
                              <CustomCalendar
                                selected={editDueDate}
                                onSelect={handleEditDueDateChange}
                                disabled={(date) => date <= editIssueDate}
                              />
                            </PopoverContent>
                          )}
                        </Popover>
                        {editErrors.dueDate && (
                          <p className="text-xs text-red-500 mt-1">{editErrors.dueDate}</p>
                        )}
                      </div>
                    </div>

                    {/* Important Toggle */}
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={editImportant ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setEditImportant(!editImportant)}
                        className={cn(
                          editImportant 
                            ? "text-yellow-700 bg-yellow-100" 
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <Star className={cn("w-4 h-4 mr-1", editImportant && "fill-current")} />
                        {editImportant ? "Important" : "Mark important"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* Actions */}
              <div className={cn(
                "flex items-center gap-1 transition-opacity duration-normal",
                (isHovered || isEditing) ? "opacity-100" : "opacity-0"
              )}>
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowDeleteModal(true)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Meta Information */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-error"
                )}>
                  <CalendarIcon className="w-3 h-3" />
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

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}