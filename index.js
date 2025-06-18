function updateLogo() {
    const isDark = document.body.classList.contains('dark-theme');
    document.getElementById('logo-img').src = isDark ? 'logo-dark.png' : 'logo1.png';
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    const isDark = body.classList.toggle('dark-theme');
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
    updateLogo();
}

// Initial logo update in case theme is set on load
window.addEventListener('DOMContentLoaded', updateLogo);

function getStarted() {
    // In a real app, this would navigate to the notes interface
    window.location.href = 'dashboard.html'; // Redirect to the dashboard page
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