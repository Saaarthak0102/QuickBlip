// Editor UI Logic
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

// Word Count and Statistics
function updateWordCount() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').innerText || document.getElementById('noteContent').textContent;
    
    const words = (title + ' ' + content).trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = (title + content).length;
    
    document.getElementById('wordCount').textContent = `${wordCount} words`;
    document.getElementById('charCount').textContent = charCount;
}

// Time Management
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('currentTime').textContent = timeString;
}

// Text Formatting
function formatText(command) {
    const editor = document.getElementById('noteContent');
    editor.focus();
    
    switch(command) {
        case 'bold':
            document.execCommand('bold', false, null);
            break;
        case 'italic':
            document.execCommand('italic', false, null);
            break;
        case 'underline':
            document.execCommand('underline', false, null);
            break;
    }
    
    updateWordCount();
}

function changeFontSize(size) {
    document.getElementById('noteContent').style.fontSize = size;
}

function insertList(type) {
    const editor = document.getElementById('noteContent');
    editor.focus();
    
    if (type === 'ul') {
        document.execCommand('insertUnorderedList', false, null);
    } else {
        document.execCommand('insertOrderedList', false, null);
    }
    
    updateWordCount();
}

function insertLink() {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:');
    if (url && text) {
        const editor = document.getElementById('noteContent');
        editor.focus();
        
        const linkHtml = `<a href="${url}" target="_blank">${text}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
        updateWordCount();
    }
}

function insertDate() {
    const editor = document.getElementById('noteContent');
    editor.focus();
    
    const date = new Date().toLocaleDateString();
    document.execCommand('insertText', false, date);
    updateWordCount();
}

function clearFormatting() {
    if (confirm('Clear all formatting? This cannot be undone.')) {
        const editor = document.getElementById('noteContent');
        editor.focus();
        document.execCommand('removeFormat', false, null);
        updateWordCount();
    }
}

// Keyboard Handling
function handleKeydown(event) {
    // Tab support for indentation
    if (event.key === 'Tab') {
        event.preventDefault();
        document.execCommand('insertText', false, '    ');
    }
}

// Navigation
function goBack() {
    if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
        window.location.href = 'dashboard.html';
    }
}

// Visual Feedback for Save
function showSaveSuccess() {
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '✅ Saved!';
    saveBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
    
    setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = '';
    }, 2000);
}

// Update last saved time display
function updateLastSavedTime() {
    document.getElementById('lastSaved').textContent = new Date().toLocaleTimeString();
}

// Load note data into UI
function loadNoteIntoUI(note) {
    document.getElementById('noteTitle').value = note.title || '';
    document.getElementById('noteContent').innerHTML = note.content || '';
    updateWordCount();
}

// Get note data from UI
function getNoteDataFromUI() {
    const title = document.getElementById('noteTitle').value || 'Untitled Note';
    const content = document.getElementById('noteContent').innerHTML;
    return { title, content };
}

// Auto-save wrapper
function autoSave() {
    const { title, content } = getNoteDataFromUI();
    
    if ((title || content) && window.getCurrentUser() && window.getCurrentNoteId()) {
        window.saveNote();
    }
}

// Initialize theme on load
applySavedTheme();
window.addEventListener('DOMContentLoaded', updateLogo);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    applySavedTheme();
    updateTime();
    updateWordCount();
    
    // Update time every second
    setInterval(updateTime, 1000);
    
    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
});

// Make functions globally accessible
window.formatText = formatText;
window.changeFontSize = changeFontSize;
window.insertList = insertList;
window.insertLink = insertLink;
window.insertDate = insertDate;
window.clearFormatting = clearFormatting;
window.handleKeydown = handleKeydown;
window.goBack = goBack;
window.updateWordCount = updateWordCount;
window.toggleTheme = toggleTheme;
window.showSaveSuccess = showSaveSuccess;
window.updateLastSavedTime = updateLastSavedTime;
window.loadNoteIntoUI = loadNoteIntoUI;
window.getNoteDataFromUI = getNoteDataFromUI;
