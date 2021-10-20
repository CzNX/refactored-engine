// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8U8ZqSASeV9CNr_B_AvSzsBimS5QMEAQ",
  authDomain: "insta-2-ed472.firebaseapp.com",
  projectId: "insta-2-ed472",
  storageBucket: "insta-2-ed472.appspot.com",
  messagingSenderId: "1068589103440",
  appId: "1:1068589103440:web:350b7cef78c0e4585f1455",
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore();
export const storage = getStorage();
