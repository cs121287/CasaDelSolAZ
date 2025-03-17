/**
 * Casa Del Sol AZ - Main JavaScript
 * Version: 1.0.1
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Cache DOM elements
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.querySelector('.back-to-top');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const testimonialDots = document.querySelectorAll('.dot');
    const testimonialPrev = document.querySelector('.testimonial-controls .prev');
    const testimonialNext = document.querySelector('.testimonial-controls .next');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetForm');
    const scrollToFormBtn = document.querySelector('.scroll-to-form');
    
    // Variables
    let currentTestimonial = 0;
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    
    // Variables for scroll behavior
    let lastScrollTop = 0;
    let scrollDirection = 'up';
    let scrollThreshold = 10; // Minimum scroll amount to trigger header behavior
    let isScrolling = false;
    
    /**
     * Initialize all functions
     */
    function init() {
        setupEventListeners();
        checkScroll();
        initAnimations();
    }
    
    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Enhanced scroll handling with throttling
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
        
        // Mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMenu);
        }
        
        // Back to top button
        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }
        
        // Accordion functionality
        accordionHeaders.forEach(header => {
            header.addEventListener('click', toggleAccordion);
        });
        
        // FAQ functionality
        faqQuestions.forEach(question => {
            question.addEventListener('click', toggleFAQ);
        });
        
        // Testimonial navigation
        if (testimonialDots.length > 0) {
            testimonialDots.forEach(dot => {
                dot.addEventListener('click', navigateToTestimonial);
            });
        }
        
        if (testimonialPrev) {
            testimonialPrev.addEventListener('click', prevTestimonial);
        }
        
        if (testimonialNext) {
            testimonialNext.addEventListener('click', nextTestimonial);
        }
        
        // Contact form submission
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Reset form button
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', resetForm);
        }
        
        // Scroll to form button
        if (scrollToFormBtn) {
            scrollToFormBtn.addEventListener('click', scrollToContactForm);
        }
    }
    
    /**
     * Enhanced scroll handling with direction detection
     */
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Determine scroll direction
        if (scrollTop > lastScrollTop + scrollThreshold) {
            scrollDirection = 'down';
            if (scrollTop > 100) { // Only hide after scrolling a bit
                header.classList.add('hide-header');
            }
        } else if (scrollTop < lastScrollTop - scrollThreshold) {
            scrollDirection = 'up';
            header.classList.remove('hide-header');
        }
        
        // Check if scrolled for header background change
        if (scrollTop > 50) {
            header.classList.add('scrolled');
            if (backToTop) backToTop.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            if (backToTop) backToTop.classList.remove('show');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }
    
    /**
     * Check scroll position to modify header - legacy function kept for compatibility
     */
    function checkScroll() {
        handleScroll(); // Just call the enhanced function
    }
    
    /**
     * Toggle mobile menu
     */
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('show');
    }
    
    /**
     * Toggle back to top button visibility - merged into handleScroll
     */
    function toggleBackToTopButton() {
        // Functionality now handled in handleScroll
    }
    
    /**
     * Scroll to top function
     * @param {Event} e - Click event
     */
    function scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    /**
     * Toggle accordion items
     */
    function toggleAccordion() {
        const parent = this.parentElement;
        const isActive = parent.classList.contains('active');
        
        // Close all accordions
        accordionHeaders.forEach(header => {
            header.parentElement.classList.remove('active');
        });
        
        // If it wasn't active, make it active
        if (!isActive) {
            parent.classList.add('active');
        }
    }
    
    /**
     * Toggle FAQ answers
     */
    function toggleFAQ() {
        this.classList.toggle('active');
        const answer = this.nextElementSibling;
        
        if (this.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = '0px';
        }
    }
    
    /**
     * Navigate to specific testimonial
     */
    function navigateToTestimonial() {
        const index = parseInt(this.getAttribute('data-index'));
        showTestimonial(index);
    }
    
    /**
     * Show previous testimonial
     */
    function prevTestimonial() {
        let index = currentTestimonial - 1;
        if (index < 0) index = testimonialSlides.length - 1;
        showTestimonial(index);
    }
    
    /**
     * Show next testimonial
     */
    function nextTestimonial() {
        let index = currentTestimonial + 1;
        if (index >= testimonialSlides.length) index = 0;
        showTestimonial(index);
    }
    
    /**
     * Show specific testimonial by index
     * @param {number} index - Testimonial index
     */
    function showTestimonial(index) {
        // Hide all testimonials
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        testimonialDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Only proceed if there are testimonials
        if (testimonialSlides.length > 0) {
            // Show the selected testimonial and mark its dot as active
            testimonialSlides[index].classList.add('active');
            if (testimonialDots[index]) {
                testimonialDots[index].classList.add('active');
            }
            
            // Update current testimonial index
            currentTestimonial = index;
        }
    }
    
    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Simulate form submission - in a real project, you'd send data to server here
        setTimeout(() => {
            contactForm.style.display = 'none';
            if (formSuccess) {
                formSuccess.classList.remove('hidden');
            }
        }, 1000);
    }
    
    /**
     * Reset contact form
     */
    function resetForm() {
        contactForm.reset();
        contactForm.style.display = 'block';
        formSuccess.classList.add('hidden');
    }
    
    /**
     * Scroll to contact form
     * @param {Event} e - Click event
     */
    function scrollToContactForm(e) {
        e.preventDefault();
        const contactFormSection = document.querySelector('.contact-form-container');
        
        if (contactFormSection) {
            contactFormSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Initialize animations on scroll
     * A simple method to handle animations without external libraries
     */
    function initAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        if (animatedElements.length === 0) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('animated');
                    
                    // Optional: stop observing after animation is applied
                    observer.unobserve(el);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            // Add base animation class
            el.classList.add('aos-init');
            
            // Start observing
            observer.observe(el);
        });
    }
    
    // Auto-rotate testimonials
    let testimonialInterval;
    function startTestimonialRotation() {
        // Only start if there are testimonials
        if (testimonialSlides.length <= 0) return;
        
        testimonialInterval = setInterval(() => {
            nextTestimonial();
        }, 5000);
    }
    
    function stopTestimonialRotation() {
        clearInterval(testimonialInterval);
    }
    
    // Start testimonial rotation if there are testimonials
    if (testimonialSlides.length > 0) {
        startTestimonialRotation();
        
        // Pause rotation on hover
        const testimonialContainer = document.querySelector('.testimonial-slider');
        if (testimonialContainer) {
            testimonialContainer.addEventListener('mouseenter', stopTestimonialRotation);
            testimonialContainer.addEventListener('mouseleave', startTestimonialRotation);
        }
    }
    
    // Initialize everything
    init();
});