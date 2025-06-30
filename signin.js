// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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

// Get the login form by its ID
const loginForm = document.getElementById('loginForm');
// Get the input fields by their IDs
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Add submit event listener for sign-in
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get the email and password values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // Sign in user with email and password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            console.log('User signed in successfully:', user);
            alert('Signed in successfully!');
            sessionStorage.setItem("userUID", user.uid);
            sessionStorage.setItem("userEmail", user.email);

            
            // Optional: Redirect to dashboard or reset form
            window.location.href = 'dashboard.html';
            loginForm.reset();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error signing in:', errorCode, errorMessage);
            
            // Handle specific error cases
            switch (errorCode) {
                case 'auth/user-not-found':
                    alert('No account found with this email. Please check your email or sign up.');
                    break;
                case 'auth/wrong-password':
                    alert('Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    alert('Please enter a valid email address.');
                    break;
                case 'auth/user-disabled':
                    alert('This account has been disabled. Please contact support.');
                    break;
                case 'auth/too-many-requests':
                    alert('Too many failed attempts. Please try again later.');
                    break;
                default:
                    alert('Error signing in: ' + errorMessage);
            }
        });
});