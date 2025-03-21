/**
 * Casa Del Sol AZ - Modern Header Enhancement
 * Optimized to work with header-scrolled.js
 * Adds mega menu functionality
 */
(function() {
  'use strict';
  
  // DOM elements cache
  let header;
  let menuToggle;
  let dropdowns;
  let dropdownToggles;
  let sectionLinks;
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  /**
   * Initialize mega menu enhancements
   */
  function init() {
    // Cache DOM elements
    header = document.getElementById('header');
    menuToggle = document.querySelector('.menu-toggle');
    dropdowns = document.querySelectorAll('.dropdown');
    dropdownToggles = document.querySelectorAll('.has-dropdown > a');
    sectionLinks = document.querySelectorAll('.section-link, .dropdown-links a[href^="#"]');
    
    // Add event listeners for better dropdown accessibility
    setupDropdownAccessibility();
    
    // Preload background image for the header
    preloadHeaderBackground();
    
    // Add click handler for menu toggle (complementing header-scrolled.js)
    if (menuToggle) {
      enhanceMenuToggle();
    }
    
    // Add keyboard navigation for dropdowns
    addKeyboardNavigation();
  }
  
  /**
   * Setup enhanced menu toggle functionality
   */
  function enhanceMenuToggle() {
    menuToggle.addEventListener('click', function() {
      menuToggle.setAttribute('aria-expanded', 
        menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      
      document.getElementById('mobile-menu').setAttribute('aria-hidden',
        document.getElementById('mobile-menu').getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
      
      // Add escape key listener when menu is open
      if (header.classList.contains('menu-open')) {
        document.addEventListener('keydown', handleEscapeKey);
      } else {
        document.removeEventListener('keydown', handleEscapeKey);
      }
    });
  }
  
  /**
   * Handle escape key to close mobile menu
   * @param {KeyboardEvent} e - Keyboard event
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      menuToggle.click();
    }
  }
  
  /**
   * Improve dropdown keyboard accessibility
   */
  function setupDropdownAccessibility() {
    // Make dropdown parent links accessible
    dropdownToggles.forEach(function(toggle) {
      // Add aria attributes
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      
      // Link the dropdown
      const dropdown = toggle.nextElementSibling;
      if (dropdown) {
        const dropdownId = 'dropdown-' + Math.random().toString(36).substr(2, 9);
        dropdown.id = dropdownId;
        toggle.setAttribute('aria-controls', dropdownId);
      }
      
      // Handle hover events for aria states
      toggle.parentElement.addEventListener('mouseenter', function() {
        toggle.setAttribute('aria-expanded', 'true');
      });
      
      toggle.parentElement.addEventListener('mouseleave', function() {
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  /**
   * Add keyboard navigation support
   */
  function addKeyboardNavigation() {
    // Handle keyboard navigation for dropdowns
    dropdownToggles.forEach(function(toggle) {
      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          e.stopPropagation();
          
          const dropdown = toggle.nextElementSibling;
          if (dropdown) {
            const firstLink = dropdown.querySelector('a');
            if (firstLink) {
              firstLink.focus();
            }
          }
        }
      });
    });
    
    // Add keyboard navigation within dropdowns
    dropdowns.forEach(function(dropdown) {
      const links = dropdown.querySelectorAll('a');
      const linksArray = Array.from(links);
      
      links.forEach(function(link, index) {
        link.addEventListener('keydown', function(e) {
          // Navigate down
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextLink = linksArray[index + 1] || linksArray[0];
            nextLink.focus();
          }
          
          // Navigate up
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevLink = linksArray[index - 1] || linksArray[linksArray.length - 1];
            prevLink.focus();
          }
          
          // Close dropdown and refocus on parent
          if (e.key === 'Escape') {
            e.preventDefault();
            const parentToggle = dropdown.previousElementSibling;
            if (parentToggle) {
              parentToggle.focus();
            }
          }
        });
      });
    });
  }
  
  /**
   * Preload header background for faster rendering when scrolled
   */
  function preloadHeaderBackground() {
    if (!header) return;
    
    const img = new Image();
    img.src = 'img/cta-bg.jpg';
    img.fetchPriority = 'low';
    img.onload = function() {
      // Background is loaded - no action needed
      console.log('Header background preloaded');
    };
  }
})();