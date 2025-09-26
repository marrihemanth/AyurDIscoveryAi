// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeArKDlDu2Gmuq59d7qVlIcdAUvpVN02Q",
  authDomain: "ayurdiscoveryai.firebaseapp.com",
  projectId: "ayurdiscoveryai",
  storageBucket: "ayurdiscoveryai.firebasestorage.app",
  messagingSenderId: "939390688755",
  appId: "1:939390688755:web:ed55a2307bcf82338ec686",
  measurementId: "G-ZRKQSPE0CX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable network connectivity (in case it was disabled)
try {
  enableNetwork(db);
} catch (error) {
  console.warn('Network enable failed:', error);
}

// Initialize Analytics (optional - only works in production)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;