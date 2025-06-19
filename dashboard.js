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

    // Create the note container
    const noteContainer = document.createElement('div');
    noteContainer.className = 'notes-container';
    noteContainer.onclick = function() { toggleExpand(this); };

    // Add the note content structure
    noteContainer.innerHTML = `
        <div class="notes-content">
            <div class="notes-header">
                New Note ${noteCounter}
            </div>
            <div class="notes-body">
                Click here to add your content...
            </div>
        </div>
    `;

    // Append to the main element
    const main = document.querySelector('main');
    if (main) {
        main.appendChild(noteContainer);

        // Optional: Scroll the new note into view
        noteContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        console.error('Main element not found!');
    }
}
