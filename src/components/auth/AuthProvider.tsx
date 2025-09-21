import { createContext, useContext, ReactNode } from 'react';
import { User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function AuthProvider({ user, onLogin, onLogout, children }: AuthProviderProps) {
  const value = {
    user,
    onLogin,
    onLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}