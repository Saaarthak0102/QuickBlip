// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBm9H2h7ITzgsNC7gx36tENx8r0vXqbFdQ",
  authDomain: "quickblip-app.firebaseapp.com",
  projectId: "quickblip-app",
  storageBucket: "quickblip-app.firebasestorage.app",
  messagingSenderId: "466569356694",
  appId: "1:466569356694:web:c22c5c14756e6a9d3be9b7",
  measurementId: "G-ELKZ0FGXBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized services
export { app, analytics, auth, db };
