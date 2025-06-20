// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
// Initialize Firebase Authentication (moved after app initialization)
const auth = getAuth(app);

// Get the signup form by its ID
const signupForm = document.getElementById('signupForm');
// Get the input fields by their IDs
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Add submit event listener
signupForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get the email and password values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up successfully
            const user = userCredential.user;
            console.log('User created successfully:', user);
            alert('Account created successfully!');
            // Optional: Redirect to dashboard or another page
            window.location.href = 'login.html';
            
            // Optional: Reset the form
            signupForm.reset();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error creating user:', errorCode, errorMessage);
            
            // Handle specific error cases
            switch (errorCode) {
                case 'auth/email-already-in-use':
                    alert('This email is already registered. Please use a different email or try signing in.');
                    break;
                case 'auth/invalid-email':
                    alert('Please enter a valid email address.');
                    break;
                case 'auth/weak-password':
                    alert('Password should be at least 6 characters long.');
                    break;
                default:
                    alert('Error creating account: ' + errorMessage);
            }
        });
});