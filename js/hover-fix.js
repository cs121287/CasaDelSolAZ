/**
 * Casa Del Sol AZ - Comprehensive Hover Fix
 * Resolves issues with links and buttons being highlighted by default
 */
(function() {
    // Fix all hover issues immediately
    function fixHoverIssues() {
        console.log("Applying hover fix...");
        
        // Reset all buttons
        document.querySelectorAll('.btn, .btn-primary, .btn-secondary').forEach(button => {
            // Remove problematic classes
            button.classList.remove('highlighted', 'hover', 'focus');
            
            // Reset any inline styles that might be causing the issue
            if (button.hasAttribute('style')) {
                button.removeAttribute('style');
            }
            
            // Reset focus
            button.blur();
        });
        
        // Reset all navigation links
        document.querySelectorAll('.nav-links li a').forEach(link => {
            // Only modify if not active
            if (!link.classList.contains('active')) {
                link.classList.remove('highlighted', 'underlined', 'hover', 'focus');
                
                if (link.hasAttribute('style')) {
                    link.removeAttribute('style');
                }
                
                // Reset focus
                link.blur();
            }
        });
        
        // Reset any orphaned :focus or :active states
        document.activeElement.blur();
    }
    
    // Run fix immediately when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixHoverIssues);
    } else {
        fixHoverIssues();
    }
    
    // Also run after a slight delay to catch any dynamic changes
    setTimeout(fixHoverIssues, 100);
    
    // Run again after page is fully loaded with all resources
    window.addEventListener('load', fixHoverIssues);
    
    // Also fix when user interacts with the page
    document.addEventListener('click', function(e) {
        // Short delay to let the click complete
        setTimeout(fixHoverIssues, 50);
    });
    
    // Add hover state handlers
    document.addEventListener('DOMContentLoaded', function() {
        // For buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.classList.add('hover-active');
            });
            
            button.addEventListener('mouseleave', function() {
                this.classList.remove('hover-active');
            });
        });
        
        // For navigation links
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.classList.add('hover-active');
            });
            
            link.addEventListener('mouseleave', function() {
                this.classList.remove('hover-active');
                
                // Ensure only active links keep their styling
                if (!this.classList.contains('active')) {
                    this.classList.remove('highlighted', 'underlined');
                }
            });
        });
    });
})();