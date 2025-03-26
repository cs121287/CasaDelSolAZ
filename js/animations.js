/**
 * Casa Del Sol AZ - Advanced GSAP Animations
 * Author: CS121287
 * Version: 2.0
 * 
 * Optimized for performance:
 * - Uses efficient selectors
 * - Batches animations with timelines
 * - On-demand animation loading with ScrollTrigger
 * - Progressive enhancement pattern
 */

// Wait until GSAP plugins are loaded
function initAnimations() {
  // Check if required GSAP plugins are available
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
  const hasSplitText = typeof SplitText !== 'undefined';
  
  // Core initialization
  function init() {
    // Initialize hero animations if not already done
    if (!document.querySelector('.hero-title.animate-in')) {
      enhanceHeroAnimation();
    }
    
    // Initialize scroll animations
    if (hasScrollTrigger) {
      initScrollAnimations();
    }
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize fancy video background parallax
    initVideoParallax();
    
    // Initialize custom cursor
    if (!isTouchDevice()) {
      initCustomCursor();
    }
  }
  
  // Enhanced hero animations with SplitText
  function enhanceHeroAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const scrollArrow = document.querySelector('.scroll-arrow');
    
    // Create timeline for hero animations
    const heroTl = gsap.timeline({
      onComplete: () => {
        // Add classes for browsers without JS or when GSAP fails
        heroTitle.classList.add('animate-in');
        heroSubtitle.classList.add('animate-in');
        heroButtons.classList.add('animate-in');
        scrollArrow.classList.add('animate-in');
      }
    });
    
    // Use SplitText for more advanced text animation if available
    if (hasSplitText && heroTitle) {
      const splitTitle = new SplitText(heroTitle, { type: "chars" });
      
      heroTl
        .fromTo(splitTitle.chars, 
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            stagger: 0.03, 
            duration: 1, 
            ease: "back.out(1.7)"
          }
        )
        .fromTo(heroSubtitle,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(heroButtons,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(scrollArrow,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2"
        );
    } else {
      // Fallback animation without SplitText
      heroTl
        .fromTo(heroTitle,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        )
        .fromTo(heroSubtitle,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(heroButtons,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(scrollArrow,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.3"
        );
    }
  }
  
  // Initialize all scroll-based animations
  function initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Create scroll-based reveal animations for all sections
    initSectionTitleAnimations();
    initRevealElements();
    initAboutAnimations();
    initServiceTabsAnimations();
    initRentalCardsAnimations();
    initFaqAnimations();
    initGalleryAnimations();
    initContactAnimations();
    
    // Header scroll effects with performance optimization
    ScrollTrigger.create({
      start: "top -50",
      end: 99999,
      onUpdate: self => {
        const scrolled = self.progress > 0.05;
        const header = document.getElementById('header');
        
        if (scrolled && !header.classList.contains('scrolled')) {
          header.classList.add('scrolled');
        } else if (!scrolled && header.classList.contains('scrolled')) {
          header.classList.remove('scrolled');
        }
      },
      onRefresh: self => self.update() // Update on resize
    });
  }
  
  // Initialize section title animations
  function initSectionTitleAnimations() {
    gsap.utils.toArray('.section-title').forEach(title => {
      ScrollTrigger.create({
        trigger: title,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(title, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          );
        }
      });
    });
  }
  
  // Initialize reveal elements animations
  function initRevealElements() {
    gsap.utils.toArray('.reveal-element').forEach(element => {
      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        once: true,
        onEnter: () => {
          element.classList.add('revealed');
        }
      });
    });
  }
  
  // About section animations
  function initAboutAnimations() {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return;
    
    ScrollTrigger.create({
      trigger: aboutSection,
      start: "top 70%",
      once: true,
      onEnter: () => {
        const image = aboutSection.querySelector('.about-image');
        const content = aboutSection.querySelector('.about-content');
        const features = aboutSection.querySelectorAll('.feature');
        
        const aboutTl = gsap.timeline();
        
        aboutTl
          .to(image, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          })
          .to(content, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          }, "-=0.6")
          .fromTo(features, 
            { opacity: 0, y: 20 },
            { 
              opacity: 1, 
              y: 0, 
              stagger: 0.1, 
              duration: 0.6,
              ease: "power2.out" 
            }, 
            "-=0.4"
          );
      }
    });
  }
  
  // Services tabs animations
  function initServiceTabsAnimations() {
    // Setup tab transitions
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        const targetPanel = document.getElementById(tabId + '-panel');
        
        if (!targetPanel) return;
        
        // Animate the panel content
        const panelImage = targetPanel.querySelector('.panel-image');
        const panelContent = targetPanel.querySelector('.panel-content');
        const panelTitle = targetPanel.querySelector('h3');
        const panelText = targetPanel.querySelector('p');
        const panelList = targetPanel.querySelectorAll('li');
        const panelButton = targetPanel.querySelector('.btn-text');
        
        const tabTl = gsap.timeline();
        
        tabTl
          .fromTo(panelImage, 
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(panelTitle,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.4"
          )
          .fromTo(panelText,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3"
          )
          .fromTo(panelList,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power2.out" },
            "-=0.3"
          )
          .fromTo(panelButton,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.2"
          );
      });
    });
    
    // Animation for initial tab
    const initialPanel = document.querySelector('.tab-panel.active');
    if (initialPanel) {
      const panelImage = initialPanel.querySelector('.panel-image');
      const panelContent = initialPanel.querySelector('.panel-content');
      
      ScrollTrigger.create({
        trigger: initialPanel,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(panelImage,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
          );
          
          gsap.fromTo(panelContent,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
          );
        }
      });
    }
  }
  
  // Rental cards animations with stagger
  function initRentalCardsAnimations() {
    const rentalCards = document.querySelectorAll('.rental-card');
    if (!rentalCards.length) return;
    
    ScrollTrigger.create({
      trigger: '.rentals-grid',
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(rentalCards, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    });
  }
  
  // FAQ accordion animations
  function initFaqAnimations() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    
    // Entrance animations
    gsap.utils.toArray('.faq-item').forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(item,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: "power2.out" }
          );
        }
      });
    });
    
    // Click animations for accordion
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            
            // Animate closing
            gsap.to(otherItem.querySelector('.faq-answer'), {
              height: 0,
              opacity: 0,
              duration: 0.4,
              ease: "power2.inOut"
            });
          }
        });
        
        // Toggle current item
        if (isOpen) {
          item.classList.remove('active');
          
          gsap.to(answer, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut"
          });
        } else {
          item.classList.add('active');
          
          // Get the natural height
          gsap.set(answer, { height: "auto", opacity: 1 });
          gsap.from(answer, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
          });
        }
      });
    });
  }
  
  // Gallery animations
  function initGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;
    
    ScrollTrigger.create({
      trigger: '.gallery-grid',
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(galleryItems, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    });
  }
  
  // Contact section animations
  function initContactAnimations() {
    const contactSection = document.querySelector('.contact-section');
    if (!contactSection) return;
    
    ScrollTrigger.create({
      trigger: contactSection,
      start: "top 70%",
      once: true,
      onEnter: () => {
        const contactCards = contactSection.querySelectorAll('.contact-card');
        const socialLinks = contactSection.querySelectorAll('.contact-social a');
        const formGroups = contactSection.querySelectorAll('.form-group');
        const submitBtn = contactSection.querySelector('.contact-form .btn');
        
        const contactTl = gsap.timeline();
        
        contactTl
          .to(contactCards, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out"
          })
          .to(socialLinks, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: "power2.out"
          }, "-=0.4")
          .fromTo(formGroups, 
            { opacity: 0, y: 20 },
            { 
              opacity: 1, 
              y: 0, 
              stagger: 0.1, 
              duration: 0.6,
              ease: "power2.out" 
            }, 
            "-=0.3"
          )
          .fromTo(submitBtn,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.2"
          );
      }
    });
  }
  
  // Video background parallax effect
  function initVideoParallax() {
    if (!hasScrollTrigger) return;
    
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) return;
    
    gsap.to(videoContainer, {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }
  
  // Smooth scrolling with GSAP
  function initSmoothScrolling() {
    // Handle nav button clicks
    document.querySelectorAll('.nav-btn, .mobile-nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.getAttribute('href');
        const element = document.querySelector(target);
        
        if (element) {
          const headerHeight = document.querySelector('.site-header').offsetHeight;
          
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: element,
              offsetY: headerHeight
            },
            ease: "power3.inOut"
          });
          
          // Close mobile menu if open
          const mobileMenu = document.querySelector('.mobile-menu');
          const hamburger = document.querySelector('.hamburger');
          if (mobileMenu && mobileMenu.classList.contains('is-active')) {
            mobileMenu.classList.remove('is-active');
            hamburger.classList.remove('is-active');
            document.body.classList.remove('menu-open');
          }
        }
      });
    });
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: 0
          },
          ease: "power3.inOut"
        });
      });
      
      // Show/hide scroll to top button
      ScrollTrigger.create({
        start: 300,
        end: 99999,
        onUpdate: self => {
          if (self.progress > 0.1) {
            scrollTopBtn.classList.add('visible');
          } else {
            scrollTopBtn.classList.remove('visible');
          }
        }
      });
    }
    
    // Logo click scrolls to top
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', e => {
        e.preventDefault();
        
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: 0
          },
          ease: "power3.inOut"
        });
      });
    }
  }
  
  // Custom cursor implementation for desktop
  function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorTrail);
    
    // Initial position
    gsap.set([cursor, cursorTrail], { opacity: 0, scale: 0 });
    
    let cursorVisible = false;
    let curX = 0;
    let curY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Show cursor on mouse move
    document.addEventListener('mousemove', e => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (!cursorVisible) {
        cursorVisible = true;
        gsap.to([cursor, cursorTrail], { 
          opacity: 1, 
          scale: 1, 
          duration: 0.3 
        });
      }
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseout', e => {
      if (!e.relatedTarget && !e.toElement) {
        cursorVisible = false;
        gsap.to([cursor, cursorTrail], { 
          opacity: 0, 
          scale: 0, 
          duration: 0.3 
        });
      }
    });
    
    // Animate cursor elements
    gsap.ticker.add(() => {
      // Smooth cursor movement
      curX += (targetX - curX) * 0.2;
      curY += (targetY - curY) * 0.2;
      
      gsap.set(cursor, { 
        left: curX, 
        top: curY 
      });
      
      gsap.to(cursorTrail, { 
        left: curX, 
        top: curY,
        duration: 0.6
      });
    });
    
    // Cursor interactions with hoverable elements
    const hoverables = document.querySelectorAll('a, button, .nav-btn, .gallery-item, .tab-btn, .faq-question');
    
    hoverables.forEach(element => {
      element.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          scale: 1.5,
          backgroundColor: 'rgba(212, 175, 55, 0.2)',
          border: '1px solid rgba(212, 175, 55, 0.6)',
          duration: 0.3
        });
        gsap.to(cursorTrail, {
          opacity: 0.1,
          duration: 0.3
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          duration: 0.3
        });
        gsap.to(cursorTrail, {
          opacity: 0.4,
          duration: 0.3
        });
      });
    });
  }
  
  // Utility function to detect touch devices
  function isTouchDevice() {
    return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
  }
  
  // Initialize all animations
  init();
}

// Check if document is already interactive
if (document.readyState !== 'loading') {
  initAnimations();
} else {
  document.addEventListener('DOMContentLoaded', initAnimations);
}