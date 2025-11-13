// firebaseConfig.js

// Firebase ki main libraries ko import karo
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <-- YEH NAYI LINE HAI

// Aapka Firebase configuration (yeh secret hai)
// Yeh values aapki 'google-services.json' se li gayi hain
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

// Firestore database ko chalu karo aur use 'db' naam se export karo
export const db = getFirestore(app);

// Firebase Auth ko chalu karo aur use 'auth' naam se export karo
export const auth = getAuth(app); // <-- YEH NAYI LINE HAI