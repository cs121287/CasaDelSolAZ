/**
 * Casa Del Sol AZ - Smooth Element Reveal (Fixed Version)
 * Animates elements as they enter the viewport without causing overlap
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elements to be revealed
    const revealElements = document.querySelectorAll('.reveal-element');
    if (revealElements.length === 0) return;
    
    // Make sure elements are visible initially to prevent content overlap
    revealElements.forEach(element => {
        element.style.opacity = '1'; 
        element.style.visibility = 'visible';
    });
    
    // Animation options for different elements
    const animationOptions = {
        'fade-up': { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
        'fade-down': { opacity: [0, 1], transform: ['translateY(-30px)', 'translateY(0)'] },
        'fade-left': { opacity: [0, 1], transform: ['translateX(-30px)', 'translateX(0)'] },
        'fade-right': { opacity: [0, 1], transform: ['translateX(30px)', 'translateX(0)'] },
        'zoom-in': { opacity: [0, 1], transform: ['scale(0.9)', 'scale(1)'] },
        'zoom-out': { opacity: [0, 1], transform: ['scale(1.1)', 'scale(1)'] }
    };
    
    // Default animation timing
    const defaultTiming = {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        fill: 'forwards'
    };
    
    // Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters viewport
        threshold: 0.15
    };
    
    // Check if Web Animation API is supported
    const supportsAnimationAPI = 'animate' in document.createElement('div');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Get animation type or use default
                const animationType = element.dataset.revealAnimation || 'fade-up';
                const delay = parseFloat(element.dataset.revealDelay || 0) * 1000;
                const duration = parseFloat(element.dataset.revealDuration || 0.8) * 1000;
                
                // Get animation properties
                const animationProps = animationOptions[animationType];
                if (!animationProps) return;
                
                // Set custom timing
                const timing = {
                    ...defaultTiming,
                    delay,
                    duration
                };
                
                // Apply animation only if supported
                if (supportsAnimationAPI) {
                    try {
                        element.animate(animationProps, timing);
                    } catch (e) {
                        console.warn('Animation failed:', e);
                        // Fallback: just make sure the element is visible
                        element.style.opacity = '1';
                        element.style.transform = 'none';
                    }
                } else {
                    // Fallback for browsers that don't support the Animation API
                    element.style.opacity = '1';
                    element.style.transform = 'none';
                    element.style.transition = `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`;
                }
                
                // Stop observing this element
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Start observing
    revealElements.forEach(element => {
        observer.observe(element);
    });
});