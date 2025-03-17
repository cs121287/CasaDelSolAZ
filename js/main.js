/**
 * Casa Del Sol AZ - Main JavaScript
 * Version: 2.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Cache DOM elements
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.querySelector('.back-to-top');
    
    /**
     * Initialize all functions
     */
    function init() {
        setupEventListeners();
        checkScroll();
    }
    
    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Enhanced scroll handling with throttling
        let isScrolling = false;
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
    }
    
    /**
     * Enhanced scroll handling with direction detection
     */
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check if scrolled for header background change
        if (scrollTop > 50) {
            header.classList.add('scrolled');
            if (backToTop) backToTop.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            if (backToTop) backToTop.classList.remove('show');
        }
    }
    
    /**
     * Check scroll position to modify header
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
     * Scroll to element with smooth behavior
     * @param {string} selector - Element selector
     */
    function scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Make scrollToElement available globally
    window.scrollToElement = scrollToElement;
    
    // Initialize everything
    init();
});