/**
 * Section Zoom Animation Script
 * Compatible with existing site animations
 * Last Modified: 2025-03-31 10:18:22
 */

(function() {
  'use strict';
  
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // For older browsers, make all sections visible without animation
    document.querySelectorAll('.section').forEach(section => {
      section.style.opacity = 1;
      section.classList.add('animate');
    });
    return;
  }
  
  // Setup Intersection Observer
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // When section enters viewport
      if (entry.isIntersecting) {
        // Add animation class after a tiny delay to ensure proper rendering
        setTimeout(() => {
          entry.target.classList.add('animate');
        }, 100);
        
        // Stop observing after animation is applied
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null, // viewport
    threshold: 0.15, // trigger when 15% of the section is visible
    rootMargin: '-50px 0px' // small offset so animation starts when properly in view
  });
  
  // Optional: Setup exit animation observer
  const exitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // When section leaves viewport, apply exit animation
        entry.target.classList.remove('animate');
        entry.target.classList.add('exit');
        
        // Reset after animation completes
        setTimeout(() => {
          entry.target.classList.remove('exit');
        }, 1000);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '-100px 0px'
  });
  
  // Start observing all sections
  document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
      // Set initial state
      section.style.opacity = 0;
      
      // Start observing for entry
      sectionObserver.observe(section);
      
      // Uncomment to enable exit animations (may cause performance issues)
      // exitObserver.observe(section);
    });
    
    console.log(`Zoom scroll animations initialized for ${sections.length} sections`);
  });
  
  // Clean up observers if page is hidden/unloaded
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sectionObserver.disconnect();
      exitObserver.disconnect();
    }
  });
})();