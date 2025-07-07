// Editor Database Operations
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, getDoc, updateDoc, setDoc, deleteDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let currentUser = null;
let currentNoteId = null;
let currentNote = null;

// Authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadNote();
    } else {
        // User is signed out, redirect to login
        window.location.href = 'login.html';
    }
});

// Load note from Firestore
async function loadNote() {
    const urlParams = new URLSearchParams(window.location.search);
    currentNoteId = urlParams.get('noteId');
    
    if (!currentNoteId || !currentUser) {
        console.error('No note ID found or user not authenticated');
        return;
    }
    
    try {
        const noteDoc = doc(db, 'notes', currentNoteId);
        const noteSnapshot = await getDoc(noteDoc);
        
        if (noteSnapshot.exists()) {
            currentNote = { id: noteSnapshot.id, ...noteSnapshot.data() };
            
            // Check if the note belongs to the current user
            if (currentNote.userId !== currentUser.uid) {
                alert('You do not have permission to access this note.');
                window.location.href = 'dashboard.html';
                return;
            }
            
            // Load note data into the UI
            window.loadNoteIntoUI(currentNote);
        } else {
            console.error('Note not found');
            alert('Note not found.');
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error loading note:', error);
        alert('Error loading note. Please try again.');
    }
}

// Save note to Firestore
async function saveNote() {
    if (!currentUser || !currentNoteId) {
        alert('Unable to save: User not authenticated or note ID missing.');
        return;
    }
    
    const { title, content } = window.getNoteDataFromUI();
    
    try {
        const noteData = {
            title: title,
            content: content,
            lastModified: new Date().toISOString(),
            userId: currentUser.uid
        };
        
        // If it's a new note, add created date
        if (currentNote && !currentNote.created) {
            noteData.created = new Date().toISOString();
        }
        
        const noteDoc = doc(db, 'notes', currentNoteId);
        await updateDoc(noteDoc, noteData);
        
        // Update current note data
        currentNote = { ...currentNote, ...noteData };
        
        // Update UI feedback
        window.updateLastSavedTime();
        window.showSaveSuccess();
        
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Error saving note. Please try again.');
    }
}

// Create a new note in Firestore
async function createNote(noteData) {
    if (!currentUser) {
        throw new Error('User not authenticated');
    }
    
    try {
        const noteDocData = {
            ...noteData,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            userId: currentUser.uid
        };
        
        const docRef = await addDoc(collection(db, 'notes'), noteDocData);
        
        return docRef.id;
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
}

// Delete current note
async function deleteCurrentNote() {
    if (!currentUser || !currentNoteId) {
        alert('Unable to delete: User not authenticated or note ID missing.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        try {
            const noteDoc = doc(db, 'notes', currentNoteId);
            await deleteDoc(noteDoc);
            
            console.log('Note deleted successfully');
            alert('Note deleted successfully.');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note. Please try again.');
        }
    }
}

// Update note metadata (tags, archived status, etc.)
async function updateNoteMetadata(metadata) {
    if (!currentUser || !currentNoteId) {
        console.error('Unable to update metadata: User not authenticated or note ID missing.');
        return;
    }
    
    try {
        const noteDoc = doc(db, 'notes', currentNoteId);
        await updateDoc(noteDoc, {
            ...metadata,
            lastModified: new Date().toISOString()
        });
        
        // Update current note data
        currentNote = { ...currentNote, ...metadata };
        
        console.log('Note metadata updated successfully');
        
    } catch (error) {
        console.error('Error updating note metadata:', error);
        throw error;
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Get current note ID
function getCurrentNoteId() {
    return currentNoteId;
}

// Get current note data
function getCurrentNote() {
    return currentNote;
}

// Make functions globally accessible
window.saveNote = saveNote;
window.loadNote = loadNote;
window.createNote = createNote;
window.deleteCurrentNote = deleteCurrentNote;
window.updateNoteMetadata = updateNoteMetadata;
window.getCurrentUser = getCurrentUser;
window.getCurrentNoteId = getCurrentNoteId;
window.getCurrentNote = getCurrentNote;
