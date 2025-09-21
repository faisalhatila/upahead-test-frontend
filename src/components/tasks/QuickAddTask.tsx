import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CustomCalendar } from '@/components/ui/custom-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskStore } from '@/stores/taskStore';
import { useTaskFocus } from './TaskFocusContext';
import { Plus, Calendar as CalendarIcon, Tag, Sparkles, Star, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function QuickAddTask() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [important, setImportant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTask } = useTaskStore();
  const { isTaskInputFocused } = useTaskFocus();

  // Predefined subject options - Engineering, Medical, Commerce focused
  const subjectOptions = [
    // Software Engineering
    'Software Development',
    'Web Development',
    'Mobile Development',
    'DevOps',
    'Data Science',
    'Machine Learning',
    'Cybersecurity',
    'Database Design',
    'System Architecture',
    'Code Review',
    
    // Other Engineering
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biomedical Engineering',
    'Aerospace Engineering',
    'Environmental Engineering',
    
    // Medical Science
    'Anatomy',
    'Physiology',
    'Pathology',
    'Pharmacology',
    'Surgery',
    'Internal Medicine',
    'Pediatrics',
    'Radiology',
    'Laboratory Work',
    'Clinical Research',
    
    // Commerce & Business
    'Accounting',
    'Finance',
    'Marketing',
    'Economics',
    'Business Analysis',
    'Project Management',
    'Supply Chain',
    'Human Resources',
    'Operations',
    'Strategy',
    
    // General
    'Research',
    'Documentation',
    'Presentation',
    'Meeting',
    'Other'
  ];

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle focus trigger from EmptyState
  useEffect(() => {
    if (isTaskInputFocused) {
      setIsExpanded(true);
      // Focus the input after a short delay to ensure smooth animation
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 150);
    }
  }, [isTaskInputFocused]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    
    try {
      const finalSubject = subject === 'Other' ? customSubject.trim() : subject;
      
      await addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate?.getTime(),
        issueDate: issueDate.getTime(),
        important,
        completed: false,
        subject: finalSubject || undefined,
        tags: [],
      });

      // Show success message
      toast.success('Task created successfully!');

      // Reset form only on success
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setIssueDate(new Date());
      setImportant(false);
      setSubject('');
      setCustomSubject('');
      setShowCustomSubject(false);
      setIsExpanded(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setIssueDate(new Date());
      setImportant(false);
      setSubject('');
      setCustomSubject('');
      setShowCustomSubject(false);
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    if (value === 'Other') {
      setShowCustomSubject(true);
    } else {
      setShowCustomSubject(false);
      setCustomSubject('');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main Input */}
        <div className={cn(
          "relative bg-surface border rounded-xl transition-all duration-300 ease-out",
          isExpanded 
            ? "border-primary task-input-expanded" 
            : "border-gray-200 hover:border-gray-300 shadow-soft hover:shadow-medium hover:scale-[1.01]"
        )}>
          <div className="flex items-center gap-3 p-4">
            <div className={cn(
              "w-6 h-6 rounded-full border-2 transition-all duration-300 ease-out",
              isExpanded 
                ? "border-primary bg-primary/10 scale-110" 
                : "border-gray-300 hover:border-gray-400"
            )} />
            
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-body text-gray-900 placeholder:text-gray-500 bg-transparent outline-none"
            />
            
            {!isExpanded && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsExpanded(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Expanded Section */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-3 task-expand-content">
              {/* Description */}
              <textarea
                placeholder="Add a description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-body-sm text-gray-700 placeholder:text-gray-400 bg-transparent outline-none resize-none"
                rows={2}
              />

              {/* Subject Field */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Subject</label>
                <Select value={subject} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {subjectOptions.map((option) => (
                      <SelectItem key={option} value={option} className="bg-white hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {option}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Custom Subject Input */}
                {showCustomSubject && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter custom subject..."
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-2 gap-3">
                {/* Issue Date */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Issue Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {format(issueDate, "MMM dd")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CustomCalendar
                        selected={issueDate}
                        onSelect={setIssueDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {dueDate ? format(dueDate, "MMM dd") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CustomCalendar
                        selected={dueDate}
                        onSelect={setDueDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={important ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setImportant(!important)}
                    className={cn(
                      important 
                        ? "text-yellow-700 bg-yellow-100" 
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <Star className={cn("w-4 h-4 mr-1", important && "fill-current")} />
                    {important ? "Important" : "Mark important"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    Tags
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI boost
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      setTitle('');
                      setDescription('');
                      setDueDate(undefined);
                      setIssueDate(new Date());
                      setImportant(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!title.trim() || isLoading}
                    className="min-w-16"
                  >
                    {isLoading ? (
                      <div className="spinner w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                    ) : (
                      'Add task'
                    )}
                  </Button>
                </div>
              </div>

              {/* Keyboard Shortcuts Hint */}
              <div className="text-xs text-gray-400 flex items-center gap-4">
                <span><kbd className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">⌘</kbd> + <kbd className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">Enter</kbd> to save</span>
                <span><kbd className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">Esc</kbd> to cancel</span>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}