/**
 * Casa Del Sol AZ - Enhanced Navigation Features
 * Complements header-scrolled.js with dropdown functionality
 * 
 * @version 3.2.0
 * @author CasaDelSolAZ
 * @updated 2025-03-21
 * @repository https://github.com/cs121287/CasaDelSolAZ
 */
(function() {
  'use strict';
  
  // DOM elements cache
  let header;
  let dropdownContainers;
  let mobileDropdownToggles;
  let initialized = false;
  
  // Constants
  const BREAKPOINT = 992;
  const CLASSES = {
    active: 'active',
    dropdown: 'dropdown',
    dropdownContent: 'mobile-dropdown-content'
  };
  
  // Feature detection for passive event listeners
  const supportsPassive = (function() {
    let result = false;
    try {
      window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
        get: function() { result = true; }
      }));
    } catch(e) {}
    return result;
  })();
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // In case the script loads after DOM is ready
    init();
  }
  
  /**
   * Initialize dropdown functionality
   * Avoids duplicating header-scrolled.js functionality
   */
  function init() {
    // Only initialize once
    if (initialized) return;
    
    // Cache DOM elements
    header = document.getElementById('header');
    dropdownContainers = document.querySelectorAll('.has-dropdown');
    mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    // Exit if no header found
    if (!header) return;
    
    // Setup dropdown functionality
    setupDesktopDropdowns();
    setupMobileDropdowns();
    setupKeyboardNavigation();
    
    // Preload the header background image
    preloadHeaderBackground();
    
    // Mark as initialized
    initialized = true;
    
    // Add resize handler with debounce
    window.addEventListener('resize', 
      debounce(handleResize, 150), 
      supportsPassive ? { passive: true } : false
    );
  }
  
  /**
   * Setup desktop dropdown accessibility and behavior
   * Enhanced with proper ARIA attributes
   */
  function setupDesktopDropdowns() {
    if (!dropdownContainers.length) return;
    
    for (let i = 0; i < dropdownContainers.length; i++) {
      const container = dropdownContainers[i];
      const dropdownLink = container.querySelector('a');
      const dropdown = container.querySelector('.' + CLASSES.dropdown);
      
      if (!dropdownLink || !dropdown) continue;
      
      // Add ARIA attributes
      dropdownLink.setAttribute('aria-haspopup', 'true');
      dropdownLink.setAttribute('aria-expanded', 'false');
      
      // Generate unique ID
      const dropdownId = 'dropdown-' + Math.floor(Math.random() * 10000);
      dropdown.id = dropdownId;
      dropdownLink.setAttribute('aria-controls', dropdownId);
      
      // Handle hover events - only update ARIA
      container.addEventListener('mouseenter', function() {
        if (window.innerWidth >= BREAKPOINT) {
          dropdownLink.setAttribute('aria-expanded', 'true');
        }
      });
      
      container.addEventListener('mouseleave', function() {
        if (window.innerWidth >= BREAKPOINT) {
          dropdownLink.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }
  
  /**
   * Setup mobile dropdown toggle functionality
   * Optimized for touch interactions
   */
  function setupMobileDropdowns() {
    if (!mobileDropdownToggles.length) return;
    
    for (let i = 0; i < mobileDropdownToggles.length; i++) {
      const toggle = mobileDropdownToggles[i];
      const content = toggle.nextElementSibling;
      
      if (!content) continue;
      
      // Set ARIA attributes
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
      
      // Generate unique ID for content
      const contentId = 'mobile-dropdown-' + Math.floor(Math.random() * 10000);
      content.id = contentId;
      toggle.setAttribute('aria-controls', contentId);
      
      // Add click handler (with touchstart for mobile)
      toggle.addEventListener('click', toggleMobileDropdown);
      
      // Make it work with keyboard
      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMobileDropdown.call(this, e);
        }
      });
    }
  }
  
  /**
   * Toggle mobile dropdown visibility
   * @param {Event} e - Event object
   */
  function toggleMobileDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const toggle = this;
    const content = toggle.nextElementSibling;
    
    if (!content) return;
    
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    // Close other dropdowns first
    for (let i = 0; i < mobileDropdownToggles.length; i++) {
      if (mobileDropdownToggles[i] !== toggle) {
        mobileDropdownToggles[i].setAttribute('aria-expanded', 'false');
        mobileDropdownToggles[i].classList.remove(CLASSES.active);
        
        const otherContent = mobileDropdownToggles[i].nextElementSibling;
        if (otherContent) {
          otherContent.classList.remove(CLASSES.active);
        }
      }
    }
    
    // Toggle this dropdown
    toggle.setAttribute('aria-expanded', !isExpanded);
    toggle.classList.toggle(CLASSES.active);
    content.classList.toggle(CLASSES.active);
  }
  
  /**
   * Setup keyboard navigation for accessibility
   */
  function setupKeyboardNavigation() {
    // Desktop dropdown keyboard support
    for (let i = 0; i < dropdownContainers.length; i++) {
      const container = dropdownContainers[i];
      const link = container.querySelector('a');
      const dropdown = container.querySelector('.' + CLASSES.dropdown);
      
      if (!link || !dropdown) continue;
      
      // Handle keyboard events on main nav links
      link.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          
          // Focus the first link in dropdown
          const firstLink = dropdown.querySelector('a');
          if (firstLink) {
            firstLink.focus();
          }
        }
      });
      
      // Handle keyboard navigation within dropdown
      const dropdownLinks = dropdown.querySelectorAll('a');
      for (let j = 0; j < dropdownLinks.length; j++) {
        dropdownLinks[j].addEventListener('keydown', function(e) {
          const index = Array.prototype.indexOf.call(dropdownLinks, this);
          
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault();
              if (index < dropdownLinks.length - 1) {
                dropdownLinks[index + 1].focus();
              } else {
                dropdownLinks[0].focus(); // Wrap to first
              }
              break;
              
            case 'ArrowUp':
              e.preventDefault();
              if (index > 0) {
                dropdownLinks[index - 1].focus();
              } else {
                dropdownLinks[dropdownLinks.length - 1].focus(); // Wrap to last
              }
              break;
              
            case 'Escape':
              e.preventDefault();
              link.focus(); // Return focus to parent link
              break;
          }
        });
      }
    }
  }
  
  /**
   * Handle window resize events
   * Close mobile menus when switching to desktop
   */
  function handleResize() {
    if (window.innerWidth >= BREAKPOINT) {
      // Close any open mobile dropdowns when resizing to desktop
      if (mobileDropdownToggles.length) {
        for (let i = 0; i < mobileDropdownToggles.length; i++) {
          if (mobileDropdownToggles[i].classList.contains(CLASSES.active)) {
            mobileDropdownToggles[i].classList.remove(CLASSES.active);
            mobileDropdownToggles[i].setAttribute('aria-expanded', 'false');
            
            const content = mobileDropdownToggles[i].nextElementSibling;
            if (content) {
              content.classList.remove(CLASSES.active);
            }
          }
        }
      }
    }
  }
  
  /**
   * Preload the header background image
   * Improves performance by loading the image before it's needed
   */
  function preloadHeaderBackground() {
    const img = new Image();
    img.src = 'img/cta-bg.jpg';
    img.fetchPriority = 'low';
  }
  
  /**
   * Debounce function to limit execution frequency
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @return {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Expose public API for potential external use
  window.CasaDelSolHeader = {
    init: init,
    refresh: function() {
      initialized = false;
      init();
    }
  };
})();