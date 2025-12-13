// Firebase configuration for KLEVIA
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCfdajcor0lTEKzUo2kvp133OaMqB5MccU",
    authDomain: "klevia-393cf.firebaseapp.com",
    projectId: "klevia-393cf",
    storageBucket: "klevia-393cf.firebasestorage.app",
    messagingSenderId: "972580965612",
    appId: "1:972580965612:web:5b3cde8e7c8badce63e9c9",
    measurementId: "G-5J1T6GVDNX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
