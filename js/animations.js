/**
 * Casa Del Sol AZ - Advanced GSAP Animations
 * Author: CS121287
 * Version: 2.0
 * 
 * Performance optimized animations:
 * - Uses efficient selectors
 * - Batches animations with timelines
 * - Implements scroll-triggered animations
 */

// Initialize when GSAP is ready
function initGSAP() {
  // Check if required GSAP plugins are loaded
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
  const hasSplitText = typeof SplitText !== 'undefined';
  
  // Initialize animations
  function init() {
    // Hero animations enhancement
    enhanceHeroAnimation();
    
    // ScrollTrigger-based animations
    if (hasScrollTrigger) {
      initScrollAnimations();
      initVideoParallax();
      initHeaderScroll();
    }
  }
  
  // Enhanced hero animations with SplitText
  function enhanceHeroAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    // If SplitText available, enhance text animation
    if (hasSplitText && heroTitle) {
      // Create timeline
      const heroTl = gsap.timeline();
      
      // Split text for character-by-character animation
      const splitTitle = new SplitText(heroTitle, { type: "chars" });
      
      heroTl.from(splitTitle.chars, {
        opacity: 0,
        y: 80,
        rotationX: -90,
        stagger: 0.03,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
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