// Dashboard Database Operations
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut as firebaseSignOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let currentUser = null;
let allNotes = [];

// Authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        window.updateProfileEmail(user.email);
        loadUserNotes();
        
        // Check if user should see welcome modal
        if (window.checkWelcomeModal) {
            window.checkWelcomeModal();
        }
    } else {
        // User is signed out, redirect to login
        window.location.href = 'login.html';
    }
});

// Load user notes from Firestore
async function loadUserNotes() {
    if (!currentUser) return;
    
    try {
        // Simplified query without orderBy to avoid potential index issues
        const notesQuery = query(
            collection(db, 'notes'),
            where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(notesQuery);
        allNotes = [];
        
        querySnapshot.forEach((doc) => {
            allNotes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort notes by lastModified date (most recent first)
        allNotes.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        if (window.displayNotes) {
            window.displayNotes(allNotes);
        } else {
            console.error('displayNotes function not available');
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        alert('Error loading notes. Please try again.');
    }
}

// Add new note function
async function addNewNote() {
    console.log('addNewNote called, currentUser:', currentUser);
    
    if (!currentUser) {
        alert('Please log in to create notes.');
        return;
    }
    
    try {
        console.log('Creating new note...');
        const noteData = {
            title: '',
            content: '',
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            userId: currentUser.uid,
            tags: [],
            archived: false
        };
        
        const docRef = await addDoc(collection(db, 'notes'), noteData);
        console.log('Note created with ID:', docRef.id);
        
        // Immediately open the editor for the new note
        window.location.href = `editor.html?noteId=${encodeURIComponent(docRef.id)}`;
        
        // Alternative: Reload notes (commented out to avoid conflicts)
        // await loadUserNotes();
        
    } catch (error) {
        console.error('Detailed error creating note:', {
            error: error,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        alert(`Error creating note: ${error.message}. Please try again.`);
    }
}

// Sign out function with Firebase
async function signOut() {
    if (confirm('Are you sure you want to sign out?')) {
        try {
            await firebaseSignOut(auth);
            console.log('User signed out successfully');
            // Clear any stored data
            localStorage.removeItem('authToken');
            sessionStorage.clear();
            // Redirect to login page
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Error signing out. Please try again.');
        }
    }
}

// Search notes functionality (wrapper for UI function)
function searchNotes(searchTerm) {
    if (!searchTerm.trim()) {
        window.displayNotes(allNotes);
        return;
    }
    
    const filteredNotes = allNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    window.displayNotes(filteredNotes);
}

// Delete note function
async function deleteNote(noteId) {
    if (!currentUser) {
        alert('Please log in to delete notes.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        try {
            await deleteDoc(doc(db, 'notes', noteId));
            console.log('Note deleted successfully');
            
            // Close any expanded notes first
            const expandedNotes = document.querySelectorAll('.notes-container.expanded');
            expandedNotes.forEach(noteContainer => {
                if (window.closeNoteZoom) {
                    // Use a slight delay to ensure the deletion alert is processed
                    setTimeout(() => {
                        window.closeNoteZoom(noteContainer);
                    }, 100);
                } else {
                    // Fallback method
                    noteContainer.classList.remove('expanded');
                    document.body.style.overflow = 'auto';
                    // Remove overlay if present
                    const overlay = document.querySelector('.note-zoom-overlay');
                    if (overlay) overlay.remove();
                }
            });
            
            // Remove from local array
            allNotes = allNotes.filter(note => note.id !== noteId);
            
            // Refresh display
            window.displayNotes(allNotes);
            
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note. Please try again.');
        }
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Get all notes
function getAllNotes() {
    return allNotes;
}

// Test Firebase connection
async function testFirebaseConnection() {
    try {
        console.log('Testing Firebase connection...');
        console.log('Auth object:', auth);
        console.log('DB object:', db);
        console.log('Current user:', currentUser);
        
        if (!currentUser) {
            console.log('No current user, testing auth state...');
            return;
        }
        
        // Try to read from Firestore
        const testQuery = query(
            collection(db, 'notes'),
            where('userId', '==', currentUser.uid)
        );
        
        console.log('Test query created:', testQuery);
        const querySnapshot = await getDocs(testQuery);
        console.log('Query successful, docs count:', querySnapshot.size);
        
    } catch (error) {
        console.error('Firebase connection test failed:', error);
    }
}

// Make functions globally accessible
window.addNewNote = addNewNote;
window.signOut = signOut;
window.searchNotes = searchNotes;
window.deleteNote = deleteNote;
window.getCurrentUser = getCurrentUser;
window.getAllNotes = getAllNotes;
window.loadUserNotes = loadUserNotes;
window.testFirebaseConnection = testFirebaseConnection;
