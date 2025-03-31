/**
 * Minimal fallback for scroll animations
 * Last Modified: 2025-03-31 19:21:57
 */

(function() {
  // Check if we need a fallback
  const hasScrollTimeline = 'AnimationTimeline' in window || CSS.supports('animation-timeline: scroll()');
  
  if (!hasScrollTimeline) {
    console.log('Browser doesn\'t support scroll timeline animations, using fallback');
    
    // Simple visibility manager
    window.addEventListener('scroll', function() {
      const sections = document.querySelectorAll('.section');
      
      sections.forEach(section => {
        const container = section.querySelector('.container');
        if (!container) return;
        
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the section is in view
        const visiblePortion = Math.min(
          Math.max(0, rect.bottom) - Math.max(0, rect.top), 
          viewportHeight
        ) / viewportHeight;
        
        // Make container visible when section is mostly in view
        if (visiblePortion > 0.5) {
          container.style.opacity = '1';
          container.style.filter = 'blur(0)';
          container.style.transform = 'none';
          container.style.visibility = 'visible';
        } else {
          container.style.opacity = '0';
          container.style.visibility = 'hidden';
        }
      });
    }, { passive: true });
    
    // Trigger initial check
    window.dispatchEvent(new Event('scroll'));
  }
})();