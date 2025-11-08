// firebase.js - Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, PhoneAuthProvider };
export default app;