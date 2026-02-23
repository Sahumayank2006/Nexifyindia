// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfLjRZXB5JPQ7n6sB7B_6bHWKqimxhfhA",
  authDomain: "campus-memory.firebaseapp.com",
  projectId: "campus-memory",
  storageBucket: "campus-memory.firebasestorage.app",
  messagingSenderId: "44047991575",
  appId: "1:44047991575:web:5ca03d748276d27078ad52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
