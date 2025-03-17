/**
 * Casa Del Sol AZ - Parallax Scrolling Effect (Fixed Version)
 * Creates depth for hero sections and background elements without overlap
 */
document.addEventListener('DOMContentLoaded', function() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    function updateParallax() {
        // Only apply parallax to elements that are in the viewport
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInViewport = (
                rect.top < window.innerHeight &&
                rect.bottom > 0
            );
            
            if (isInViewport) {
                const scrollPosition = window.pageYOffset;
                const elementTop = element.getBoundingClientRect().top + scrollPosition;
                const elementHeight = element.offsetHeight;
                const windowHeight = window.innerHeight;
                
                // Calculate offset based on element's position in the viewport
                const viewportOffset = scrollPosition - elementTop + windowHeight;
                
                // Apply parallax only if element is visible
                if (viewportOffset > 0 && viewportOffset < elementHeight + windowHeight) {
                    const speed = parseFloat(element.dataset.speed) || 0.3;
                    const yPos = -(viewportOffset - windowHeight) * speed;
                    
                    // Apply transform to the background, not to the element itself
                    element.style.backgroundPosition = `center ${yPos}px`;
                }
            }
        });
    }

    // Initial update
    updateParallax();
    
    // Update on scroll with requestAnimationFrame for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Update on window resize
    window.addEventListener('resize', updateParallax);
});