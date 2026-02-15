import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXuUtPXF-3NqRlKSZQknwVFGrKVOabQdk",
  authDomain: "techstore-auth-50daf.firebaseapp.com",
  projectId: "techstore-auth-50daf",
  storageBucket: "techstore-auth-50daf.firebasestorage.app",
  messagingSenderId: "447263377722",
  appId: "1:447263377722:web:3f3e660676cace41d1a803",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();




