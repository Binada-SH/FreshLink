// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr2p75IFQR1cUKhePUehedKWHyMzltM00",
  authDomain: "freshlink-d0f2d.firebaseapp.com",
  projectId: "freshlink-d0f2d",
  storageBucket: "freshlink-d0f2d.appspot.com",
  messagingSenderId: "218505282608",
  appId: "1:218505282608:web:e5241ff96d025c193919f5",
  measurementId: "G-E0SGB47RCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);