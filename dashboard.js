const THEME_KEY = 'theme';
let noteCounter = 1;

function applySavedTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

applySavedTheme();

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

// Initial logo update in case theme is set on load
window.addEventListener('DOMContentLoaded', updateLogo);

function toggleExpand(element) {
            // Check if this container is already expanded
            const isExpanded = element.classList.contains('expanded');
            
            // First, collapse all expanded containers
            const allContainers = document.querySelectorAll('.notes-container');
            allContainers.forEach(container => {
                container.classList.remove('expanded');
            });
            
            // If the clicked container wasn't expanded, expand it
            if (!isExpanded) {
                element.classList.add('expanded');
            }
        }

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function addNewNote() {
    noteCounter++;

    // Create a unique note ID
    const noteId = `note-${Date.now()}-${noteCounter}`;

    // Define the note structure
    const noteData = {
        id: noteId,
        title: `New Note ${noteCounter}`,
        content: '',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        tags: [],
        archived: false
    };

    // Save the note to localStorage
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push(noteData);
    localStorage.setItem('notes', JSON.stringify(notes));

    // Optionally, create the note visually in dashboard.html
    const noteContainer = document.createElement('div');
    noteContainer.className = 'notes-container';
    noteContainer.onclick = function() { toggleExpand(this); };
    noteContainer.innerHTML = `
        <div class="notes-content">
            <div class="notes-header">
                ${noteData.title}
            </div>
            <div class="notes-body">
                Click here to add your content...
            </div>
        </div>
    `;
    const main = document.querySelector('main');
    if (main) {
        main.appendChild(noteContainer);
        noteContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        console.error('Main element not found!');
    }

    // Redirect to editor.html with the note ID as a query parameter
    window.location.href = `editor.html?noteId=${encodeURIComponent(noteId)}`;
}

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


function signOut() {
    // Add your sign out logic
    if (confirm('Are you sure you want to sign out?')) {
        console.log('User signed out');
        // Clear any stored tokens/data
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        // Redirect to sign in page if possible
        if (typeof window !== 'undefined' && window.location) {
            window.location.href = 'login.html';
        } else {
            console.error('Unable to redirect: window.location is not available.');
        }
    }
}

// Function to update profile email dynamically
function updateProfileEmail(email) {
    document.getElementById('profile-email').textContent = email;
    document.getElementById('profile-menu-email').textContent = email;
}