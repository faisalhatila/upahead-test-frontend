import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Firebase configuration
// You'll need to replace these with your actual Firebase project config


console.log({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://demo-project-default-rtdb.firebaseio.com"
})

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://demo-project-default-rtdb.firebaseio.com"
};

// Check if Firebase config is properly set up
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "demo-api-key" && 
         firebaseConfig.projectId !== "demo-project-id" &&
         firebaseConfig.apiKey.length > 10 &&
         firebaseConfig.projectId.length > 5;
};

// Initialize Firebase with error handling
let app;
let auth;
let googleProvider;
let db;
let realtimeDb;

try {
  console.log('Firebase config check:', {
    apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
    projectId: firebaseConfig.projectId,
    isConfigured: isFirebaseConfigured()
  });
  
  if (isFirebaseConfigured()) {
    console.log('Initializing Firebase with real config...');
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
    realtimeDb = getDatabase(app);
    console.log('Firebase initialized successfully!');
  } else {
    console.warn('Firebase not properly configured. Using demo mode.');
    // Create mock objects for development
    app = null;
    auth = null;
    googleProvider = null;
    db = null;
    realtimeDb = null;
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  app = null;
  auth = null;
  googleProvider = null;
  db = null;
  realtimeDb = null;
}

// Export Firebase services
export { auth, googleProvider, db, realtimeDb };
export default app;
