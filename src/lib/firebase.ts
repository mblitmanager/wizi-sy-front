import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAAaZVClNlMXgTktyjUg8lhLG5zSue4YY",
  authDomain: "wizi-learn.firebaseapp.com",
  projectId: "wizi-learn",
  storageBucket: "wizi-learn.firebasestorage.app",
  messagingSenderId: "69521612278",
  appId: "1:69521612278:web:94878d39de047f667c7bd7",
  measurementId: "G-01Y7WC8383"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 