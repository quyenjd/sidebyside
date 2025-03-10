import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  appId: process.env.NEXT_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  measurementId: process.env.NEXT_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.NEXT_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_FIREBASE_PROJECT_ID}.firebasestorage.app`,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
