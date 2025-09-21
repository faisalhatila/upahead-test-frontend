# Zustand State Management Guide

This project now uses Zustand for global state management, providing a clean and efficient way to manage authentication and task data across the application.

## 🏪 Available Stores

### 1. Auth Store (`useAuthStore`)
Manages user authentication state and Firebase auth integration.

**State:**
- `user`: Current authenticated user
- `loading`: Authentication loading state
- `initialized`: Whether auth has been initialized

**Actions:**
- `signIn()`: Sign in with Google
- `signOut()`: Sign out user
- `setUser(user)`: Set current user
- `setLoading(loading)`: Set loading state
- `initialize()`: Initialize auth state listener

### 2. Task Store (`useTaskStore`)
Manages task data and operations.

**State:**
- `tasks`: Array of all tasks
- `loading`: Task loading state
- `currentUserId`: Currently active user ID

**Actions:**
- `addTask(task)`: Add a new task
- `updateTask(id, updates)`: Update existing task
- `deleteTask(id)`: Delete a task
- `toggleTask(id)`: Toggle task completion
- `setCurrentUser(userId)`: Set current user
- `getTasksByFilter(filter)`: Get filtered tasks
- `getTasksByUser(userId)`: Get tasks for specific user

## 🎯 Usage Examples

### Using Individual Stores

```tsx
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';

function MyComponent() {
  const { user, signIn, signOut } = useAuthStore();
  const { tasks, addTask, updateTask } = useTaskStore();

  return (
    <div>
      <p>Welcome, {user?.displayName}</p>
      <button onClick={signIn}>Sign In</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Using the Combined Hook

```tsx
import { useAppState } from '@/hooks/useAppState';

function MyComponent() {
  const { 
    isAuthenticated, 
    userTasks, 
    completedTasks,
    addTask 
  } = useAppState();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>You have {userTasks.length} tasks</p>
          <p>{completedTasks.length} completed</p>
        </div>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

### Using the Combined Store

```tsx
import { useAppStore } from '@/stores';

function MyComponent() {
  const { auth, tasks } = useAppStore();

  return (
    <div>
      <p>User: {auth.user?.displayName}</p>
      <p>Tasks: {tasks.tasks.length}</p>
    </div>
  );
}
```

## 🔄 State Persistence

Both stores use Zustand's `persist` middleware to automatically save state to localStorage:

- **Auth Store**: Persists user data and initialization state
- **Task Store**: Persists tasks and current user ID

## 🚀 Benefits

1. **Simplified State Management**: No more complex context providers
2. **Automatic Persistence**: State survives page refreshes
3. **Type Safety**: Full TypeScript support
4. **Performance**: Only re-renders components that use changed state
5. **Developer Experience**: Easy to use and debug
6. **Firebase Integration**: Seamless integration with Firebase auth

## 🔧 Migration from Context

The old context-based approach has been replaced with Zustand stores:

- `AuthProvider` now uses `useAuthStore` internally
- `TaskProvider` now uses `useTaskStore` internally
- Components can use stores directly or through the existing providers

## 📁 File Structure

```
src/
├── stores/
│   ├── authStore.ts      # Authentication state
│   ├── taskStore.ts      # Task management state
│   └── index.ts          # Store exports
├── hooks/
│   └── useAppState.ts    # Combined state hook
└── components/
    └── examples/
        └── ZustandExample.tsx  # Usage examples
```

## 🎨 Best Practices

1. **Use the combined hook** (`useAppState`) for components that need both auth and task data
2. **Use individual stores** for components that only need specific state
3. **Keep stores focused** - each store should handle one domain
4. **Use TypeScript** - all stores are fully typed
5. **Leverage persistence** - let Zustand handle localStorage automatically

## 🔍 Debugging

Zustand stores can be easily debugged:

1. Install Redux DevTools extension
2. Add `devtools` middleware to stores (optional)
3. Use browser dev tools to inspect state changes
4. Console log store state for debugging

## 🚀 Next Steps

- Add more stores as needed (e.g., UI state, settings)
- Implement optimistic updates for better UX
- Add store middleware for logging or analytics
- Consider adding store selectors for computed values
