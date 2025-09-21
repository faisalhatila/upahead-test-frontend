import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Convert Firebase User to our User interface
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email || '',
  displayName: firebaseUser.displayName || '',
  photoURL: firebaseUser.photoURL || undefined,
});

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase not configured. Please check your setup.');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return mapFirebaseUser(result.user);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  if (!auth) {
    // Demo mode - just return
    return;
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Listen to authentication state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    // Demo mode - return a no-op unsubscribe function
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(mapFirebaseUser(firebaseUser));
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (!auth) {
    return null;
  }
  
  const firebaseUser = auth.currentUser;
  return firebaseUser ? mapFirebaseUser(firebaseUser) : null;
};
