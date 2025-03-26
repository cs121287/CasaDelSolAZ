/**
 * GSAP Animations for Casa Del Sol AZ
 * Author: CS121287
 * Version: 1.0
 * 
 * Optimized for performance:
 * - Uses efficient selectors
 * - Batches animations with timelines
 * - Leverages ScrollTrigger for on-demand animations
 * - Implements progressive enhancement
 */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Create smooth scroller (core experience)
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.2,
    effects: true,
    normalizeScroll: true
  });

  // Initialize hero section animations immediately
  initHeroAnimations();
  
  // Initialize header animations
  initHeaderAnimations();
  
  // Use requestIdleCallback to initialize non-critical animations
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initScrollAnimations());
  } else {
    setTimeout(() => initScrollAnimations(), 200);
  }
});

/**
 * Initialize hero section animations (critical)
 */
function initHeroAnimations() {
  // Split text for character-by-character animation
  const heroTitle = new SplitText(".hero-section h1", { type: "chars" });
  
  // Create hero timeline
  const heroTl = gsap.timeline();
  
  heroTl
    .from(heroTitle.chars, {
      opacity: 0,
      y: 100,
      rotateX: -90,
      stagger: 0.03,
      duration: 1,
      ease: "back.out(1.7)"
    })
    .from(".hero-section p", {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5")
    .from(".hero-cta .btn", {
      opacity: 0,
      y: 20,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.7")
    .from(".scroll-indicator", {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5");
  
  // Subtle parallax effect for the background
  gsap.to(".hero-background", {
    y: -80,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
}

/**
 * Initialize header animations
 */
function initHeaderAnimations() {
  // Header scroll effect
  ScrollTrigger.create({
    start: 100,
    toggleClass: {className: 'scrolled', targets: '.site-header'}
  });
}

/**
 * Initialize scroll-triggered animations (non-critical)
 */
function initScrollAnimations() {
  // Section titles animation
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: "top 80%"
      },
      opacity: 0,
      y: 50,
      duration: 0.8
    });
  });

  // About section animations
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: "top 70%"
      }
    });

    aboutTl
      .to(".about-image", {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.2,
        ease: "power4.inOut"
      })
      .from(".about-text h3", {
        opacity: 0,
        y: 30,
        duration: 0.8
      }, "-=0.8")
      .from(".about-text p", {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8
      }, "-=0.6")
      .from(".feature", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6
      }, "-=0.4");
  }

  // Services tab animations
  const servicesSection = document.querySelector('#services');
  if (servicesSection) {
    // Animation for initial tab
    animateActiveTab();
    
    // Setup animations for tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.addEventListener('click', animateActiveTab);
    });
  }

  // Rental cards animation
  gsap.utils.toArray('.rental-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1
    });
  });

  // FAQ accordion animation
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 90%"
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: i * 0.1
    });
  });

  // Gallery items animation
  gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 90%"
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: i * 0.1
    });
  });

  // Contact section animation
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    const contactTl = gsap.timeline({
      scrollTrigger: {
        trigger: contactSection,
        start: "top 70%"
      }
    });

    contactTl
      .from(".contact-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6
      })
      .from(".contact-social a", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6
      }, "-=0.4")
      .from(".form-group", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6
      }, "-=0.8")
      .from(".contact-form .btn", {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, "-=0.4");
  }
}

/**
 * Helper function to animate the active tab content
 */
function animateActiveTab() {
  // Get the currently active tab panel
  const activePanel = document.querySelector('.tab-panel.active');
  if (!activePanel) return;
  
  // Create animation timeline for active panel
  const tabTl = gsap.timeline();
  
  tabTl
    .from(activePanel.querySelector('.panel-image'), {
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: "power3.out"
    })
    .from(activePanel.querySelector('.panel-content h3'), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .from(activePanel.querySelector('.panel-content p'), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .from(activePanel.querySelectorAll('.panel-content li'), {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.6")
    .from(activePanel.querySelector('.panel-content .btn-text'), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4");
}

/**
 * Custom cursor for interactive elements (progressive enhancement)
 * Only enabled on non-touch devices
 */
if (!('ontouchstart' in window)) {
  window.addEventListener('load', () => {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    // Create cursor follower
    const follower = document.createElement('div');
    follower.classList.add('cursor-follower');
    document.body.appendChild(follower);
    
    // Initial position off-screen
    gsap.set([cursor, follower], {
      xPercent: -50,
      yPercent: -50,
      x: -100,
      y: -100
    });
    
    // Track mouse position
    let mouseX = -100;
    let mouseY = -100;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Move cursor immediately to reduce lag
      gsap.set(cursor, {
        x: mouseX,
        y: mouseY
      });
    });
    
    // Animate follower with slight delay
    gsap.ticker.add(() => {
      gsap.to(follower, {
        duration: 0.3,
        x: mouseX,
        y: mouseY
      });
    });
    
    // Scale effect on interactive elements
    const interactives = document.querySelectorAll('a, button, .gallery-item, .tab-btn, .faq-question');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to([cursor, follower], {
          scale: 1.5,
          duration: 0.3
        });
      });
      
      el.addEventListener('mouseleave', () => {
        gsap.to([cursor, follower], {
          scale: 1,
          duration: 0.3
        });
      });
    });
  });
}