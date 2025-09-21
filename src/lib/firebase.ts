import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Firebase configuration
// You'll need to replace these with your actual Firebase project config

// Replace these with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Replace with your actual API key
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "upahead-test.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "upahead-test",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "upahead-test.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012", // Replace with your actual sender ID
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890", // Replace with your actual app ID
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://upahead-test-default-rtdb.firebaseio.com"
};

// Check if Firebase config is properly set up
const isFirebaseConfigured = () => {
  // Check if we have environment variables set (production) or valid config values
  const hasEnvVars = !!import.meta.env.VITE_FIREBASE_API_KEY;
  const hasValidApiKey = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 20 && !firebaseConfig.apiKey.includes('xxxxx');
  const hasValidProjectId = firebaseConfig.projectId && firebaseConfig.projectId.length > 5;
  const hasValidSenderId = firebaseConfig.messagingSenderId && firebaseConfig.messagingSenderId.length > 5;
  const hasValidAppId = firebaseConfig.appId && firebaseConfig.appId.length > 10;
  
  return (hasEnvVars || hasValidApiKey) && hasValidProjectId && hasValidSenderId && hasValidAppId;
};

// Initialize Firebase with error handling
let app;
let auth;
let googleProvider;
let db;
let realtimeDb;

try {
  const configCheck = {
    apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId.substring(0, 20) + '...',
    isConfigured: isFirebaseConfigured(),
    envVars: {
      hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
      hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
      hasAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      hasMessagingSenderId: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID
    },
    validation: {
      hasEnvVars: !!import.meta.env.VITE_FIREBASE_API_KEY,
      hasValidApiKey: firebaseConfig.apiKey && firebaseConfig.apiKey.length > 20 && !firebaseConfig.apiKey.includes('xxxxx'),
      hasValidProjectId: firebaseConfig.projectId && firebaseConfig.projectId.length > 5,
      hasValidSenderId: firebaseConfig.messagingSenderId && firebaseConfig.messagingSenderId.length > 5,
      hasValidAppId: firebaseConfig.appId && firebaseConfig.appId.length > 10
    }
  };
  
  console.log('Firebase config check:', configCheck);
  
  // Always try to initialize Firebase if we have environment variables
  if (import.meta.env.VITE_FIREBASE_API_KEY || isFirebaseConfigured()) {
    console.log('Initializing Firebase with config...');
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
