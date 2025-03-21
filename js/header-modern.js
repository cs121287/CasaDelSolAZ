/**
 * Casa Del Sol AZ - Dropdown Functionality Only
 * Compatible with header-scrolled.js
 * Optimized for performance
 * 
 * @version 1.0.0
 * @updated 2025-03-21 21:54:27
 * @repository https://github.com/cs121287/CasaDelSolAZ
 */
(function() {
  'use strict';
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  function init() {
    // Set up dropdown functionality
    setupMobileDropdowns();
    setupDesktopDropdowns();
    
    // Preload header background image
    preloadHeaderBackground();
  }
  
  /**
   * Setup mobile dropdown toggles
   */
  function setupMobileDropdowns() {
    const toggles = document.querySelectorAll('.mobile-dropdown-toggle');
    if (!toggles.length) return;
    
    for (let i = 0; i < toggles.length; i++) {
      const toggle = toggles[i];
      const content = toggle.nextElementSibling;
      
      if (!content) continue;
      
      // Add ARIA attributes
      toggle.setAttribute('aria-expanded', 'false');
      
      // Add click handler
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Toggle dropdown
        this.classList.toggle('active');
        this.setAttribute('aria-expanded', 
          this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        content.classList.toggle('active');
        
        // Close other dropdowns
        for (let j = 0; j < toggles.length; j++) {
          if (toggles[j] !== this && toggles[j].classList.contains('active')) {
            toggles[j].classList.remove('active');
            toggles[j].setAttribute('aria-expanded', 'false');
            
            const otherContent = toggles[j].nextElementSibling;
            if (otherContent) {
              otherContent.classList.remove('active');
            }
          }
        }
      });
    }
  }
  
  /**
   * Setup desktop dropdown accessibility
   */
  function setupDesktopDropdowns() {
    const containers = document.querySelectorAll('.has-dropdown');
    if (!containers.length) return;
    
    for (let i = 0; i < containers.length; i++) {
      const link = containers[i].querySelector('a');
      if (!link) continue;
      
      // Add ARIA attributes
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');
      
      // Update ARIA on hover
      containers[i].addEventListener('mouseenter', function() {
        link.setAttribute('aria-expanded', 'true');
      });
      
      containers[i].addEventListener('mouseleave', function() {
        link.setAttribute('aria-expanded', 'false');
      });
    }
  }
  
  /**
   * Preload header background image
   */
  function preloadHeaderBackground() {
    const img = new Image();
    img.src = 'img/cta-bg.jpg';
    img.fetchPriority = 'low';
  }
})();