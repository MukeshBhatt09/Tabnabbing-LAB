document.addEventListener('DOMContentLoaded', function() {
    // Load existing comments from localStorage
    loadComments();
    
    // Add event listener to the submit button
    document.getElementById('submit-comment').addEventListener('click', addComment);
});

function addComment() {
    const nameInput = document.getElementById('name');
    const commentTextInput = document.getElementById('comment-text');
    
    const name = nameInput.value.trim();
    const commentText = commentTextInput.value.trim();
    
    // Validate inputs
    if (name === '' || commentText === '') {
        alert('Please fill in all fields');
        return;
    }
    
    // Create comment object
    const comment = {
        id: Date.now(),
        name: name,
        text: commentText,
        date: new Date().toLocaleString()
    };
    
    // Save comment
    saveComment(comment);
    
    // Clear input fields
    nameInput.value = '';
    commentTextInput.value = '';
    
    // Refresh comments display
    loadComments();
}

function saveComment(comment) {
    // Get existing comments from localStorage
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    // Add new comment
    comments.push(comment);
    
    // Save back to localStorage
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Add this function to convert URLs to clickable links
function linkify(text) {
    const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    return text.replace(urlRegex, function(match, linkText, url) {
        // Create embedded links with the specified text while keeping vulnerability
        return `<a href="${url}" target="_blank" rel="opener" onclick="let newWin = window.open('${url}', '_blank'); if(newWin) newWin.opener = window; return false;">${linkText}</a>`;
    });
}

// Then modify your loadComments function to use this
function deleteComment(commentId) {
    // Get existing comments
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    // Filter out the deleted comment
    comments = comments.filter(comment => comment.id !== commentId);
    
    // Save back to localStorage
    localStorage.setItem('comments', JSON.stringify(comments));
    
    // Refresh comments display
    loadComments();
}

function loadComments() {
    const commentsContainer = document.getElementById('comments-container');
    
    // Get comments from localStorage
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    // Clear container
    commentsContainer.innerHTML = '';
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }
    
    // Display comments in reverse order (newest first)
    comments.reverse().forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${escapeHTML(comment.name)}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-content">${linkify(escapeHTML(comment.text))}</div>
            <div class="comment-actions">
                <button class="delete-button" onclick="deleteComment(${comment.id})">Delete</button>
            </div>
        `;
        
        commentsContainer.appendChild(commentElement);
    });
}

// Helper function to escape HTML to prevent XSS attacks
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}