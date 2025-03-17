/**
 * Force remove focus and active states when clicking elsewhere on the page
 */
document.addEventListener('click', function(e) {
    // Is the click outside navigation and buttons?
    if (!e.target.closest('.nav-links') && !e.target.closest('.btn')) {
        // Force blur on any focused elements
        if (document.activeElement) {
            document.activeElement.blur();
        }
        
        // Remove any active classes from non-active navigation items
        document.querySelectorAll('.nav-links li a').forEach(link => {
            if (!link.classList.contains('active')) {
                link.classList.remove('highlighted', 'underlined');
            }
        });
        
        // Reset all buttons to default state
        document.querySelectorAll('.btn').forEach(button => {
            button.classList.remove('highlighted');
        });
    }
});

// Reset states when page loads/reloads
window.addEventListener('load', function() {
    // Remove focus from any elements
    if (document.activeElement) {
        document.activeElement.blur();
    }
    
    // Reset button states
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.classList.remove('highlighted');
    });
});