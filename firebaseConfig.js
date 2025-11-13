// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- YEH BADLAAV HAIN ---
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// -------------------------

// Aapka Firebase configuration (yeh wahi hai)
const firebaseConfig = {
  apiKey: "AIzaSyC-Tz0QZzeZE9LTwD5PQGIadfD4LCI9iTU",
  authDomain: "myinventoryapp-77be8.firebaseapp.com",
  projectId: "myinventoryapp-77be8",
  storageBucket: "myinventoryapp-77be8.firebasestorage.app",
  messagingSenderId: "595033320816",
  appId: "1:595033320816:android:36f651c551d8d53d8573b5"
};

// Firebase ko in keys ke saath chalu karo
const app = initializeApp(firebaseConfig);

// Firestore database (Database)
export const db = getFirestore(app);

// Firebase Auth (Login/Signup) - NAYA TAREEKA
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});