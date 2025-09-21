import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChange, signInWithGoogle, signOutUser, User } from '@/lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  unsubscribe?: () => void;
}

interface AuthActions {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  initialize: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      loading: true,
      initialized: false,

      // Actions
      signIn: async () => {
        try {
          set({ loading: true });
          await signInWithGoogle();
          // User will be set by the auth state listener
        } catch (error) {
          console.error('Sign in error:', error);
          set({ loading: false });
          throw error;
        }
      },

      signOut: async () => {
        try {
          set({ loading: true });
          await signOutUser();
          set({ user: null, loading: false });
        } catch (error) {
          console.error('Sign out error:', error);
          set({ loading: false });
          throw error;
        }
      },

      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
      setInitialized: (initialized) => set({ initialized }),

      initialize: () => {
        const { initialized } = get();
        if (initialized) return;

        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChange((user) => {
          set({ user, loading: false, initialized: true });
        });

        // Store the unsubscribe function for cleanup
        set({ unsubscribe });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        initialized: state.initialized 
      }),
    }
  )
);

// Initialize auth state when the store is created
// Only initialize in browser environment and after a small delay to ensure Firebase is ready
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure Firebase is initialized
  setTimeout(() => {
    try {
      useAuthStore.getState().initialize();
    } catch (error) {
      console.error('Failed to initialize auth store:', error);
    }
  }, 100);
}
