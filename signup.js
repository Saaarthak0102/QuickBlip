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

function getStarted() {
    window.location.href = 'dashboard.html'; // Redirect to the dashboard page
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