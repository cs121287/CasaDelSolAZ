/**
 * Casa Del Sol AZ - Unified Header JavaScript
 * Combines functionality from:
 * - header-scroll.js
 * - mobile-menu-dropdowns.js
 * - header-modern.js
 * 
 * Optimized for maximum performance with minimal DOM operations
 * 
 * @version 2.0.0
 * @updated 2025-03-21 23:21:35
 * @repository https://github.com/cs121287/CasaDelSolAZ
 */
(function() {
  'use strict';
  
  // DOM elements cache
  let header;
  let menuToggle;
  let lastScrollTop = 0;
  let ticking = false;
  let scrollDirection = 'none';
  let dropdownContainers;
  let mobileDropdownToggles;
  let initialized = false;
  
  // Feature detection
  const supportsPassive = (function() {
    let result = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() { result = true; }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch(e) {}
    return result;
  })();
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  /**
   * Initialize all header functionality
   */
  function init() {
    if (initialized) return;
    
    // Cache DOM elements
    header = document.getElementById('header');
    menuToggle = document.querySelector('.menu-toggle');
    dropdownContainers = document.querySelectorAll('.has-dropdown');
    mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    // Exit if header doesn't exist
    if (!header) return;
    
    // Initial scroll state check
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    }
    
    // Initialize all functionality
    setupScrollBehavior();
    setupMobileMenuToggle();
    setupMobileDropdowns();
    setupDesktopDropdowns();
    initSectionLinks();
    
    // Preload header background image
    preloadHeaderBackground();
    
    initialized = true;
  }
  
  /**
   * Setup header scroll behavior
   */
  function setupScrollBehavior() {
    // Efficient scroll handling with requestAnimationFrame
    window.addEventListener('scroll', function() {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Determine scroll direction
      scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
      lastScrollTop = currentScrollTop;
      
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll(currentScrollTop, scrollDirection);
          ticking = false;
        });
        
        ticking = true;
      }
    }, supportsPassive ? { passive: true } : false);
  }
  
  /**
   * Handle scroll events
   * @param {number} scrollTop - Current scroll position
   * @param {string} direction - Scroll direction ('up' or 'down')
   */
  function handleScroll(scrollTop, direction) {
    // Toggle scrolled class
    if (scrollTop > 50) {
      if (!header.classList.contains('scrolled')) {
        header.classList.add('scrolled');
      }
    } else {
      header.classList.remove('scrolled');
    }
    
    // Handle header visibility based on scroll direction
    if (!header.classList.contains('menu-open')) {
      if (direction === 'up' && scrollTop > 200) {
        // Scrolling UP - hide header
        if (!header.classList.contains('header-hidden') && !header.classList.contains('section-clicked')) {
          header.classList.remove('header-visible');
          header.classList.add('header-hidden');
        }
      } else if (direction === 'down' || scrollTop <= 50) {
        // Scrolling DOWN or at top - show header
        header.classList.remove('header-hidden', 'section-clicked');
        header.classList.add('header-visible');
      }
    }
  }
  
  /**
   * Setup mobile menu toggle
   */
  function setupMobileMenuToggle() {
    if (!menuToggle) return;
    
    menuToggle.addEventListener('click', function() {
      header.classList.toggle('menu-open');
      
      const isOpen = header.classList.contains('menu-open');
      
      // Update ARIA attributes
      this.setAttribute('aria-expanded', isOpen);
      document.getElementById('mobile-menu').setAttribute('aria-hidden', !isOpen);
      
      // Toggle body scroll
      document.body.style.overflow = isOpen ? 'hidden' : '';
      
      // Add scrolled class if necessary
      if (!isOpen && window.scrollY > 50) {
        header.classList.add('scrolled');
      }
      
      // Add/remove escape key listener
      if (isOpen) {
        document.addEventListener('keydown', handleEscapeKey);
      } else {
        document.removeEventListener('keydown', handleEscapeKey);
      }
    });
  }
  
  /**
   * Handle escape key to close menus
   * @param {KeyboardEvent} e - Keyboard event
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      menuToggle.click();
    }
  }
  
  /**
   * Setup mobile dropdown functionality
   */
  function setupMobileDropdowns() {
    if (!mobileDropdownToggles.length) return;
    
    for (let i = 0; i < mobileDropdownToggles.length; i++) {
      const toggle = mobileDropdownToggles[i];
      const content = toggle.nextElementSibling;
      
      if (!content) continue;
      
      // Setup accessibility attributes
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('role', 'button');
      
      // Generate unique ID for ARIA association
      const contentId = 'mobile-dropdown-' + Math.floor(Math.random() * 10000);
      content.id = contentId;
      toggle.setAttribute('aria-controls', contentId);
      
      // Add click handler
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Close other dropdowns first
        for (let j = 0; j < mobileDropdownToggles.length; j++) {
          if (mobileDropdownToggles[j] !== this && mobileDropdownToggles[j].classList.contains('active')) {
            mobileDropdownToggles[j].classList.remove('active');
            mobileDropdownToggles[j].setAttribute('aria-expanded', 'false');
            
            const otherContent = mobileDropdownToggles[j].nextElementSibling;
            if (otherContent) {
              otherContent.classList.remove('active');
            }
          }
        }
        
        // Toggle this dropdown
        this.classList.toggle('active');
        this.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('active');
      });
      
      // Add keyboard support
      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    }
  }
  
  /**
   * Setup desktop dropdown accessibility
   */
  function setupDesktopDropdowns() {
    if (!dropdownContainers.length) return;
    
    for (let i = 0; i < dropdownContainers.length; i++) {
      const container = dropdownContainers[i];
      const link = container.querySelector('a');
      const dropdown = container.querySelector('.dropdown');
      
      if (!link || !dropdown) continue;
      
      // Add ARIA attributes
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');
      
      // Generate unique ID for accessibility
      const dropdownId = 'dropdown-' + Math.floor(Math.random() * 10000);
      dropdown.id = dropdownId;
      link.setAttribute('aria-controls', dropdownId);
      
      // Handle hover events
      container.addEventListener('mouseenter', function() {
        link.setAttribute('aria-expanded', 'true');
      });
      
      container.addEventListener('mouseleave', function() {
        link.setAttribute('aria-expanded', 'false');
      });
      
      // Add keyboard support
      link.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          
          // Focus first dropdown link
          const firstLink = dropdown.querySelector('a');
          if (firstLink) {
            firstLink.focus();
          }
        }
      });
      
      // Add keyboard navigation within dropdown
      const dropdownLinks = dropdown.querySelectorAll('a');
      for (let j = 0; j < dropdownLinks.length; j++) {
        dropdownLinks[j].addEventListener('keydown', function(e) {
          const idx = Array.from(dropdownLinks).indexOf(this);
          
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault();
              if (idx < dropdownLinks.length - 1) {
                dropdownLinks[idx + 1].focus();
              } else {
                dropdownLinks[0].focus(); // Wrap to first
              }
              break;
              
            case 'ArrowUp':
              e.preventDefault();
              if (idx > 0) {
                dropdownLinks[idx - 1].focus();
              } else {
                dropdownLinks[dropdownLinks.length - 1].focus(); // Wrap to last
              }
              break;
              
            case 'Escape':
              e.preventDefault();
              link.focus(); // Return to parent link
              break;
          }
        });
      }
    }
  }
  
  /**
   * Initialize smooth scrolling for section links
   */
  function initSectionLinks() {
    const sectionLinks = document.querySelectorAll('.section-link');
    
    if (sectionLinks.length === 0) return;
    
    for (let i = 0; i < sectionLinks.length; i++) {
      sectionLinks[i].addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get target section ID from href
        const targetId = this.getAttribute('href');
        if (!targetId || targetId.charAt(0) !== '#') return;
        
        // Find target element
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Keep header visible when clicking section links
          header.classList.add('header-visible');
          header.classList.remove('header-hidden');
          header.classList.add('section-clicked');
          
          // Calculate header height dynamically
          const headerHeight = header.offsetHeight;
          
          // Get element position relative to document
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
          
          // Smooth scroll to target
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (header.classList.contains('menu-open')) {
            header.classList.remove('menu-open');
            document.body.style.overflow = '';
          }
          
          // Update URL hash
          history.pushState(null, null, targetId);
        }
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