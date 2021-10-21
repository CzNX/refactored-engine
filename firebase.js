// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH,
  projectId: process.env.NEXT_PUBLIC_FB_PID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MSG,
  appId: process.env.NEXT_PUBLIC_FB_APP,
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore();
export const storage = getStorage();
