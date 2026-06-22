import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAp3FxHZPMFmRvLO8x93f57x9KO_9Kq3fs",
  authDomain: "login-made.firebaseapp.com",
  projectId: "login-made",
  storageBucket: "login-made.firebasestorage.app",
  messagingSenderId: "766754168538",
  appId: "1:766754168538:web:0a78b08a8958e59c12cfe3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-ccfa85e0-a720-4780-88bd-93acdf22c517");
