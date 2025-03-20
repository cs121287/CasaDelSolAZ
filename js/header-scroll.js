/**
 * Header scroll behavior for CasaDelSolAZ
 * Optimized for performance with requestAnimationFrame
 */
document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('header');
  const menuToggle = document.querySelector('.menu-toggle');
  let lastScrollTop = 0;
  let ticking = false;
  
  // Handle section links with smooth scrolling
  initSectionLinks();
  
  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      header.classList.toggle('menu-open');
      
      if (!header.classList.contains('menu-open') && window.scrollY > 50) {
        header.classList.add('scrolled');
      }
    });
  }
  
  // Efficient scroll handling with requestAnimationFrame
  window.addEventListener('scroll', function() {
    lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll(lastScrollTop);
        ticking = false;
      });
      
      ticking = true;
    }
  });
  
  // Initial check
  handleScroll(window.scrollY || document.documentElement.scrollTop);
  
  function handleScroll(scrollTop) {
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
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        // Scrolling down - hide header
        if (!header.classList.contains('header-hidden')) {
          header.classList.remove('header-visible');
          header.classList.add('header-hidden');
        }
      } else {
        // Scrolling up - show header
        if (header.classList.contains('header-hidden')) {
          header.classList.remove('header-hidden');
          header.classList.add('header-visible');
        }
      }
    }
  }
  
  function initSectionLinks() {
    // Get all section links
    const sectionLinks = document.querySelectorAll('.section-link');
    
    if (sectionLinks.length === 0) return;
    
    // Add click handler to each section link
    sectionLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get target section ID from href
        const targetId = this.getAttribute('href');
        if (!targetId || targetId.charAt(0) !== '#') return;
        
        // Find target element
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Calculate header height dynamically
          const headerHeight = header.offsetHeight;
          
          // Get element position relative to the document
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
          }
          
          // Update URL hash (optional)
          history.pushState(null, null, targetId);
        }
      });
    });
  }
});