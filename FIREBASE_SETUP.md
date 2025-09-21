# Firebase Setup Instructions

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "taskflow-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Google" as a sign-in provider
5. Add your project's support email
6. Save the changes

## 3. Create a Web App

1. In your Firebase project, click the web icon (`</>`) to add a web app
2. Enter an app nickname (e.g., "TaskFlow Web")
3. Check "Also set up Firebase Hosting" if you want to deploy later
4. Click "Register app"
5. Copy the Firebase configuration object

## 4. Set Up Environment Variables

1. Create a `.env` file in your project root
2. Add the following variables with your Firebase config values:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

## 5. Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. Add your development domain (e.g., `localhost:5173`) to authorized domains
3. Add your production domain when ready to deploy

## 6. Test the Setup

1. Run your development server: `npm run dev`
2. Try signing in with Google
3. Check the Firebase Console to see if users are being created

## Next Steps

- Set up Firestore for task storage
- Configure Firebase Realtime Database if needed
- Set up Firebase Hosting for deployment
