import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Uncommented

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEr7yBrJd55XmGo_zTq35WoWb9t2NkceI",
  authDomain: "taskzen-yafgm.firebaseapp.com",
  projectId: "taskzen-yafgm",
  storageBucket: "taskzen-yafgm.firebasestorage.app",
  messagingSenderId: "200890839133",
  appId: "1:200890839133:web:6e81340561af006d975db4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app); // Uncommented

export { app, auth, db }; // Exported db
