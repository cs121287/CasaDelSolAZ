/**
 * Casa Del Sol AZ - Advanced GSAP Animations
 * Author: CS121287
 * Version: 2.0 - Updated 2025-03-31 04:36:31
 * 
 * Performance optimized animations:
 * - Uses efficient selectors
 * - Batches animations with timelines
 * - Implements scroll-triggered animations
 * - Added Silk background effect
 */

// Initialize when GSAP is ready
function initGSAP() {
  // Check if required GSAP plugins are loaded
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
  
  // Initialize animations
  function init() {
    // Add silk background effect to problematic sections
    applySilkBackground();
    
    // Hero animations enhancement
    enhanceHeroAnimation();
    
    // ScrollTrigger-based animations
    if (hasScrollTrigger) {
      initScrollAnimations();
      initVideoParallax();
      initHeaderScroll();
    }
  }
  
  // Apply silk background effect
  function applySilkBackground() {
    // Select sections with visibility issues
    const sectionsNeedingFix = [
      document.querySelector('.about-section'),
      document.querySelector('.rentals-section'),
      document.querySelector('.gallery-section')
    ];
    
    // Apply silk effect
    sectionsNeedingFix.forEach(section => {
      if (section) {
        section.classList.add('fake-shader', 'silk');
        
        // Ensure z-index and position are correct
        gsap.set(section, {
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#000000'
        });
        
        // Ensure content is above the background effect
        const container = section.querySelector('.container');
        if (container) {
          gsap.set(container, {
            position: 'relative',
            zIndex: 5
          });
        }
        
        // Make all text and images visible
        gsap.set(section.querySelectorAll('.reveal-element, img, h2, h3, p'), {
          position: 'relative',
          zIndex: 10,
          color: '#ffffff',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        });
      }
    });
    
    // Make reveal elements visible
    gsap.set('.reveal-element', {
      opacity: 1,
      visibility: 'visible'
    });
  }
  
  // Enhanced hero animations - fallback to basic animations if SplitText isn't available
  function enhanceHeroAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    // Standard animation without SplitText dependency
    if (heroTitle) {
      // Create timeline for sequenced animations
      const heroTl = gsap.timeline();
      
      // Animate the whole title with a professional fade + slide
      heroTl.fromTo(heroTitle, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      // Animate subtitle after title
      if (heroSubtitle) {
        heroTl.fromTo(heroSubtitle,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.2" // Start slightly before previous animation completes
        );
      }
      
      // Animate buttons and indicators
      const heroButtons = document.querySelector('.hero-buttons');
      const scrollIndicator = document.querySelector('.scroll-indicator');
      
      if (heroButtons) {
        heroTl.fromTo(heroButtons,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" },
          "-=0.1"
        );
      }
      
      if (scrollIndicator) {
        heroTl.fromTo(scrollIndicator,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power1.in" },
          "+=0.5"
        );
      }
    }
  }
  
  // Initialize ScrollTrigger animations
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Section title animations
    gsap.utils.toArray('.section-title').forEach(title => {
      ScrollTrigger.create({
        trigger: title,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(title, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          );
        }
      });
    });
    
    // Modified reveal animations - make elements always visible first
    gsap.utils.toArray('.reveal-element').forEach(element => {
      // Ensure element is visible
      gsap.set(element, { opacity: 1, visibility: 'visible' });
      
      // Then add animation
      ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(element, 
            { y: 30, opacity: 0.7 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          );
        }
      });
    });
    
    // Scroll-to-top button visibility
    ScrollTrigger.create({
      start: "top -300",
      end: 99999,
      onUpdate: self => {
        const scrollTop = document.getElementById('scroll-top');
        if (!scrollTop) return;
        
        if (self.progress > 0.1) {
          scrollTop.classList.add('visible');
        } else {
          scrollTop.classList.remove('visible');
        }
      }
    });
    
    // Scroll-to-top functionality
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: {
            y: 0,
            autoKill: true
          },
          ease: "power3.inOut"
        });
      });
    }
  }
  
  // Parallax effect for video container
  function initVideoParallax() {
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer || !hasScrollTrigger) return;
    
    gsap.to(videoContainer, {
      y: 100,
      scale: 1.05,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }
  
  // Enhanced header scroll effect
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header || !hasScrollTrigger) return;
    
    ScrollTrigger.create({
      start: 50,
      end: 51,
      onEnter: () => header.classList.add('scrolled'),
      onLeaveBack: () => header.classList.remove('scrolled')
    });
  }
  
  // Run initialization
  init();
}

// Execute when document is ready
if (document.readyState !== 'loading') {
  initGSAP();
} else {
  document.addEventListener('DOMContentLoaded', initGSAP);
}

// Fallback - ensure elements are visible even if animations fail
window.addEventListener('load', function() {
  document.querySelectorAll('.reveal-element').forEach(el => {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
  });
});