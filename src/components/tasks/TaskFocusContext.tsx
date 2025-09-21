import { createContext, useContext, ReactNode, useState } from 'react';

interface TaskFocusContextType {
  focusTaskInput: () => void;
  isTaskInputFocused: boolean;
}

const TaskFocusContext = createContext<TaskFocusContextType | null>(null);

interface TaskFocusProviderProps {
  children: ReactNode;
}

export function TaskFocusProvider({ children }: TaskFocusProviderProps) {
  const [isTaskInputFocused, setIsTaskInputFocused] = useState(false);

  const focusTaskInput = () => {
    setIsTaskInputFocused(true);
    // Reset after a short delay to allow for re-triggering
    setTimeout(() => setIsTaskInputFocused(false), 100);
  };

  const value = {
    focusTaskInput,
    isTaskInputFocused,
  };

  return (
    <TaskFocusContext.Provider value={value}>
      {children}
    </TaskFocusContext.Provider>
  );
}

export function useTaskFocus() {
  const context = useContext(TaskFocusContext);
  if (!context) {
    throw new Error('useTaskFocus must be used within a TaskFocusProvider');
  }
  return context;
}
