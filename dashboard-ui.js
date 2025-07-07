// Dashboard UI Logic
const THEME_KEY = 'theme';

// Theme Management
function applySavedTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

function updateLogo() {
    const isDark = document.body.classList.contains('dark-theme');
    document.getElementById('logo-img').src = isDark ? 'logo-dark.png' : 'logo1.png';
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    const isDark = body.classList.toggle('dark-theme');
    // Save the selected theme to localStorage
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
    updateLogo();
}

// Profile Menu Management
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    const profileBtn = document.getElementById('profileMenuBtn');
    
    if (profileMenu.classList.contains('show')) {
        // Hide menu
        profileMenu.classList.remove('show');
        profileBtn.classList.remove('active');
    } else {
        // Show menu
        profileMenu.classList.add('show');
        profileBtn.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const profile = document.querySelector('.profile');
    const profileMenu = document.getElementById('profileMenu');
    const profileBtn = document.getElementById('profileMenuBtn');
    
    if (!profile.contains(event.target)) {
        profileMenu.classList.remove('show');
        profileBtn.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const profileMenu = document.getElementById('profileMenu');
        const profileBtn = document.getElementById('profileMenuBtn');
        profileMenu.classList.remove('show');
        profileBtn.classList.remove('active');
    }
});

// Notes Display
function displayNotes(notes) {
    const main = document.querySelector('main');
    if (!main) return;
    
    // Clear all existing notes
    main.innerHTML = '';
    
    // Display notes
    notes.forEach(note => {
        const noteContainer = document.createElement('div');
        noteContainer.className = 'notes-container';
        noteContainer.setAttribute('data-note-id', note.id);
        noteContainer.onclick = function(e) { 
            // Prevent zoom if clicking on action buttons
            if (!e.target.closest('.note-actions')) {
                toggleNoteZoom(noteContainer, note.id); 
            }
        };
        
        // Truncate content for preview
        const previewContent = note.content ? 
            (note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content) :
            'Click to add content...';
        
        const createdDate = new Date(note.created).toLocaleDateString();
        const lastModifiedDate = new Date(note.lastModified).toLocaleDateString();
        const lastModifiedTime = new Date(note.lastModified).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Determine if we should show created or last modified
        const isModified = note.created !== note.lastModified;
        const dateInfo = isModified ? 
            `Updated: ${lastModifiedDate} ${lastModifiedTime}` : 
            `Created: ${createdDate}`;
        
        noteContainer.innerHTML = `
            <div class="notes-content">
                <div class="notes-header">
                    ${note.title || 'Untitled Note'}
                </div>
                <div class="notes-body">
                    ${previewContent}
                    <div class="note-date-info">
                        <small>${dateInfo}</small>
                    </div>
                </div>
                <div class="note-actions" style="display: none;">
                    <button class="note-action-btn edit-btn" onclick="event.stopPropagation(); editNote('${note.id}')">
                        ✏️ Edit
                    </button>
                    <button class="note-action-btn delete-btn" onclick="event.stopPropagation(); deleteNoteConfirm('${note.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
        
        // Add fade-in animation
        noteContainer.style.opacity = '0';
        noteContainer.style.transform = 'translateY(20px)';
        main.appendChild(noteContainer);
        
        // Trigger animation after a small delay
        setTimeout(() => {
            noteContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            noteContainer.style.opacity = '1';
            noteContainer.style.transform = 'translateY(0)';
        }, 50);
    });
}

// Navigation
function openNoteEditor(noteId) {
    window.location.href = `editor.html?noteId=${encodeURIComponent(noteId)}`;
}

// Note Zoom Functionality
function toggleNoteZoom(noteContainer, noteId) {
    const isExpanded = noteContainer.classList.contains('expanded');
    
    if (isExpanded) {
        // Close zoom
        closeNoteZoom(noteContainer);
    } else {
        // Close any other expanded notes first
        const expandedNotes = document.querySelectorAll('.notes-container.expanded');
        expandedNotes.forEach(note => closeNoteZoom(note));
        
        // Open zoom
        openNoteZoom(noteContainer, noteId);
    }
}

function openNoteZoom(noteContainer, noteId) {
    // Remove any existing transitions temporarily to avoid conflicts
    noteContainer.style.transition = 'none';
    
    noteContainer.classList.add('expanded');
    document.body.style.overflow = 'hidden';
    
    // Re-enable transitions after the class is added
    setTimeout(() => {
        noteContainer.style.transition = '';
    }, 50);
    
    // Show action buttons
    const actions = noteContainer.querySelector('.note-actions');
    if (actions) {
        actions.style.display = 'flex';
    }
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'note-zoom-overlay';
    overlay.onclick = () => closeNoteZoom(noteContainer);
    document.body.appendChild(overlay);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'note-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeNoteZoom(noteContainer);
    };
    noteContainer.appendChild(closeBtn);
}

function closeNoteZoom(noteContainer) {
    noteContainer.classList.remove('expanded');
    document.body.style.overflow = 'auto';
    
    // Hide action buttons
    const actions = noteContainer.querySelector('.note-actions');
    if (actions) {
        actions.style.display = 'none';
    }
    
    // Remove overlay
    const overlay = document.querySelector('.note-zoom-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Remove close button
    const closeBtn = noteContainer.querySelector('.note-close-btn');
    if (closeBtn) {
        closeBtn.remove();
    }
}

// Edit note function
function editNote(noteId) {
    window.location.href = `editor.html?noteId=${encodeURIComponent(noteId)}`;
}

// Delete note confirmation
function deleteNoteConfirm(noteId) {
    if (window.deleteNote) {
        window.deleteNote(noteId);
    }
}


// Profile Update
function updateProfileEmail(email) {
    document.getElementById('profile-email').textContent = email;
    document.getElementById('profile-menu-email').textContent = email;
}

// Smooth scrolling for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize theme on load
applySavedTheme();
window.addEventListener('DOMContentLoaded', updateLogo);

// Welcome Modal Functions
function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        // Mark user as having seen the welcome
        localStorage.setItem('hasSeenWelcome', 'true');
    }
}

// Check if user should see welcome modal
function checkWelcomeModal() {
    // Always show welcome modal on login
    // Delay showing modal slightly to ensure page is loaded
    setTimeout(() => {
        showWelcomeModal();
    }, 500);
}

// Make functions globally accessible
window.toggleTheme = toggleTheme;
window.toggleProfileMenu = toggleProfileMenu;
window.displayNotes = displayNotes;
window.updateProfileEmail = updateProfileEmail;
window.openNoteEditor = openNoteEditor;
window.showWelcomeModal = showWelcomeModal;
window.closeWelcomeModal = closeWelcomeModal;
window.checkWelcomeModal = checkWelcomeModal;
window.editNote = editNote;
window.deleteNoteConfirm = deleteNoteConfirm;
window.toggleNoteZoom = toggleNoteZoom;
window.closeNoteZoom = closeNoteZoom;
