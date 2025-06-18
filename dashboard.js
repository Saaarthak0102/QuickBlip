let isDarkMode = false;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (isDarkMode) {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️ Light Mode';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.innerHTML = '🌙 Dark Mode';
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