import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/lib/auth';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin?: (user: any) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const user = await signInWithGoogle();
      toast.success('Successfully signed in!');
      if (onLogin) {
        onLogin(user);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Check if it's a Firebase configuration error
      if (error instanceof Error && error.message.includes('Firebase')) {
        console.log({
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project-id",
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
          appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
          databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://demo-project-default-rtdb.firebaseio.com"
        })
        toast.error('Firebase not configured. Please check your setup.');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-xl shadow-large p-8 border border-gray-200">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
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
            <h1 className="text-title text-gray-900 mb-2">Welcome to TaskFlow</h1>
            <p className="text-body-sm text-gray-600">
              Your minimal, delightful task manager
            </p>
            <div className="mt-2 px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full inline-block">
              Firebase Connected - Ready to use
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="spinner w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full mr-2" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Lightning Fast</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">AI Powered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}