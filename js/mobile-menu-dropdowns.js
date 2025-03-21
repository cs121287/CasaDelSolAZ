/**
 * Mobile Menu Dropdown Functionality for CasaDelSolAZ
 * Optimized for performance with minimal DOM operations
 * Last updated: 2025-03-21
 */
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    if (dropdownToggles.length === 0) return;
    
    // Add click handlers to each dropdown toggle
    dropdownToggles.forEach(function(toggle) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Toggle active state
        this.classList.toggle('active');
        
        // Find dropdown content
        const content = this.nextElementSibling;
        if (!content) return;
        
        // Toggle dropdown visibility
        content.classList.toggle('active');
        
        // Close other dropdowns
        dropdownToggles.forEach(function(otherToggle) {
          if (otherToggle !== toggle && otherToggle.classList.contains('active')) {
            otherToggle.classList.remove('active');
            const otherContent = otherToggle.nextElementSibling;
            if (otherContent) {
              otherContent.classList.remove('active');
            }
          }
        });
      });
    });
    
    // Enhance accessibility
    setupAccessibility(dropdownToggles);
  });
  
  /**
   * Setup accessibility features for mobile dropdowns
   * @param {NodeList} toggles - The dropdown toggle buttons
   */
  function setupAccessibility(toggles) {
    toggles.forEach(function(toggle) {
      // Add ARIA attributes
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('role', 'button');
      
      // Find and set up content
      const content = toggle.nextElementSibling;
      if (!content) return;
      
      const contentId = 'mobile-dropdown-' + Math.random().toString(36).substr(2, 9);
      content.id = contentId;
      toggle.setAttribute('aria-controls', contentId);
      
      // Update ARIA on toggle
      toggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
      });
      
      // Add keyboard support
      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }
})();