/**
 * Casa Del Sol AZ - Enhanced Header Scroll Effect
 * Version: 2.2.0
 * Features:
 * - Transparent header on index.html fades to background image when scrolling down
 * - Header hides when scrolling down and shows when scrolling up
 * - Smooth transitions between all states
 */
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    if (!header) return;
    
    // Variables to track scroll position and direction
    let lastScrollTop = 0;
    let ticking = false;
    const scrollThreshold = 5; // Minimum scroll amount to consider
    
    // Set initial state based on scroll position
    checkScrollState();
    
    // Check scroll position and direction when user scrolls
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScrollState();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function checkScrollState() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isScrollingDown = scrollTop > lastScrollTop;
        const scrollDifference = Math.abs(scrollTop - lastScrollTop);
        
        // Don't react to tiny scroll amounts
        if (scrollDifference < scrollThreshold) {
            lastScrollTop = scrollTop;
            return;
        }
        
        // Always show header at top of page
        if (scrollTop <= 50) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
            
            // Reset header styles when at top
            if (header.classList.contains('transparent')) {
                header.classList.remove('header-scrolled');
                header.classList.remove('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        } 
        else {
            // Apply scrolled styles
            if (header.classList.contains('transparent')) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.add('scrolled');
            }
            
            // When scrolling down far enough, hide header
            if (scrollTop > 200) {
                if (isScrollingDown && !header.classList.contains('menu-open')) {
                    header.classList.add('header-hidden');
                    header.classList.remove('header-visible');
                } else if (!isScrollingDown) {
                    // When scrolling up, show header
                    header.classList.remove('header-hidden');
                    header.classList.add('header-visible');
                }
            } else {
                // Always visible in the top area of the page
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
            }
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Handle mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('show');
            header.classList.toggle('menu-open');
            
            // Ensure header is visible when menu is open
            if (navLinks.classList.contains('show')) {
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
            }
        });
    }
});