// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'zee-state.firebaseapp.com',
  projectId: 'zee-state',
  storageBucket: 'zee-state.appspot.com',
  messagingSenderId: '348507702000',
  appId: '1:348507702000:web:e7f73588bd7ae2e41ab835',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
