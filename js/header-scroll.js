/**
 * Casa Del Sol AZ - Header Scroll Effect
 * Version: 1.0.0
 * Makes the header transparent at the top and changes as user scrolls down
 */
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    
    // Only apply scroll effect to transparent headers
    if (!header || !header.classList.contains('transparent')) {
        return;
    }
    
    // Set initial state based on scroll position
    checkScroll();
    
    // Check scroll position when user scrolls
    window.addEventListener('scroll', checkScroll);
    
    function checkScroll() {
        // Add scrolled class when user scrolls down 50px or more
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Additional handling for mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            header.classList.toggle('menu-open');
        });
    }
});