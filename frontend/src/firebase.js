
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqE_BrLsRsAzLKg6U6VWH7HZ-ATFdcoLY",
  authDomain: "e-commerce-website-d76b5.firebaseapp.com",
  projectId: "e-commerce-website-d76b5",
  storageBucket: "e-commerce-website-d76b5.appspot.com",
  messagingSenderId: "2258050565",
  appId: "1:2258050565:web:d0edb679813636b774c66c",
  measurementId: "G-ELWF3JMGNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;

