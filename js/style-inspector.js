document.addEventListener('DOMContentLoaded', function() {
    // Check for problematic classes or inline styles
    console.log("Running style inspector...");
    
    // Check buttons
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach((button, index) => {
        console.log(`Button ${index}:`, {
            classList: Array.from(button.classList),
            inlineStyle: button.getAttribute('style'),
            computedBackgroundColor: window.getComputedStyle(button).backgroundColor
        });
        
        // Remove any problematic inline styles or classes
        button.removeAttribute('style');
        button.classList.remove('highlighted', 'underlined', 'active');
    });
    
    // Check nav links
    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach((link, index) => {
        const isActive = link.classList.contains('active');
        console.log(`Nav Link ${index}:`, {
            href: link.getAttribute('href'),
            classList: Array.from(link.classList),
            inlineStyle: link.getAttribute('style'),
            isActive: isActive,
            computedTextDecoration: window.getComputedStyle(link).textDecoration
        });
        
        // Only remove classes if not active
        if (!isActive) {
            link.removeAttribute('style');
            link.classList.remove('highlighted', 'underlined');
        }
    });
});