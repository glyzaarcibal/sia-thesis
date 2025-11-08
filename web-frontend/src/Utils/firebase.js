import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM9BhvbdV-PdxG6jZwgEj7kYgpnAkkyhk",
  authDomain: "pathfinder-272e0.firebaseapp.com",
  projectId: "pathfinder-272e0",
  storageBucket: "pathfinder-272e0.firebasestorage.app",
  messagingSenderId: "254197455598",
  appId: "1:254197455598:web:75d53bc6e169e755e931ff",
  measurementId: "G-3YRJS9SYK5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const analytics = getAnalytics(app);

export { auth, analytics };
