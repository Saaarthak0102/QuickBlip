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

        // Editor functionality
        let noteContent = '';
        let noteTitle = '';

        function updateWordCount() {
            const title = document.getElementById('noteTitle').value;
            const content = document.getElementById('noteContent').value;
            
            const words = (title + ' ' + content).trim().split(/\s+/).filter(word => word.length > 0);
            const wordCount = words.length;
            const charCount = (title + content).length;
            
            document.getElementById('wordCount').textContent = `${wordCount} words`;
            document.getElementById('charCount').textContent = charCount;
        }

        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            document.getElementById('currentTime').textContent = timeString;
        }

        function formatText(command) {
            const textarea = document.getElementById('noteContent');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            
            if (selectedText) {
                let formattedText = '';
                switch(command) {
                    case 'bold':
                        formattedText = `**${selectedText}**`;
                        break;
                    case 'italic':
                        formattedText = `*${selectedText}*`;
                        break;
                    case 'underline':
                        formattedText = `__${selectedText}__`;
                        break;
                }
                
                textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
                textarea.focus();
                textarea.setSelectionRange(start, start + formattedText.length);
                updateWordCount();
            }
        }

        function changeFontSize(size) {
            document.getElementById('noteContent').style.fontSize = size;
        }

        function insertList(type) {
            const textarea = document.getElementById('noteContent');
            const start = textarea.selectionStart;
            const listItem = type === 'ul' ? '• ' : '1. ';
            const textToInsert = '\n' + listItem;
            
            textarea.value = textarea.value.substring(0, start) + textToInsert + textarea.value.substring(start);
            textarea.focus();
            textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
            updateWordCount();
        }

        function insertLink() {
            const url = prompt('Enter URL:');
            const text = prompt('Enter link text:');
            if (url && text) {
                const textarea = document.getElementById('noteContent');
                const start = textarea.selectionStart;
                const linkText = `[${text}](${url})`;
                
                textarea.value = textarea.value.substring(0, start) + linkText + textarea.value.substring(start);
                textarea.focus();
                textarea.setSelectionRange(start + linkText.length, start + linkText.length);
                updateWordCount();
            }
        }

        function insertDate() {
            const textarea = document.getElementById('noteContent');
            const start = textarea.selectionStart;
            const date = new Date().toLocaleDateString();
            
            textarea.value = textarea.value.substring(0, start) + date + textarea.value.substring(start);
            textarea.focus();
            textarea.setSelectionRange(start + date.length, start + date.length);
            updateWordCount();
        }

        function clearFormatting() {
            if (confirm('Clear all formatting? This cannot be undone.')) {
                const textarea = document.getElementById('noteContent');
                // Remove common markdown formatting
                textarea.value = textarea.value
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\*(.*?)\*/g, '$1')
                    .replace(/__(.*?)__/g, '$1')
                    .replace(/\[(.*?)\]\(.*?\)/g, '$1');
                updateWordCount();
            }
        }

        function handleKeydown(event) {
            // Tab support for indentation
            if (event.key === 'Tab') {
                event.preventDefault();
                const textarea = event.target;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                
                textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
                textarea.setSelectionRange(start + 4, start + 4);
            }
        }

        function saveNote() {
            const title = document.getElementById('noteTitle').value || 'Untitled Note';
            const content = document.getElementById('noteContent').value;
            
            // In a real app, this would save to a backend
            const noteData = {
                title: title,
                content: content,
                lastModified: new Date().toISOString()
            };
            
            // For demo purposes, save to localStorage
            const notes = JSON.parse(localStorage.getItem('quickblip-notes') || '[]');
            const existingNoteIndex = notes.findIndex(note => note.title === title);
            
            if (existingNoteIndex >= 0) {
                notes[existingNoteIndex] = noteData;
            } else {
                notes.push(noteData);
            }
            
            localStorage.setItem('quickblip-notes', JSON.stringify(notes));
            
            // Update last saved time
            document.getElementById('lastSaved').textContent = new Date().toLocaleTimeString();
            
            // Visual feedback
            const saveBtn = document.querySelector('.save-btn');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '✅ Saved!';
            saveBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
            
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.style.background = '';
            }, 2000);
        }

        function goBack() {
            if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
                // In a real app, this would navigate back to the dashboard
                window.location.href = 'dashboard.html';
            }
        }

        function autoSave() {
            const title = document.getElementById('noteTitle').value;
            const content = document.getElementById('noteContent').value;
            
            if (title || content) {
                saveNote();
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            applySavedTheme();
            updateTime();
            updateWordCount();
            
            // Update time every second
            setInterval(updateTime, 1000);
            
            // Auto-save every 30 seconds
            setInterval(autoSave, 30000);
            
            // Load existing note if editing
            const urlParams = new URLSearchParams(window.location.search);
            const noteTitle = urlParams.get('title');
            if (noteTitle) {
                const notes = JSON.parse(localStorage.getItem('quickblip-notes') || '[]');
                const note = notes.find(n => n.title === noteTitle);
                if (note) {
                    document.getElementById('noteTitle').value = note.title;
                    document.getElementById('noteContent').value = note.content;
                    updateWordCount();
                }
            }
        });