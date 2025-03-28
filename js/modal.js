/**
 * Optimized Contact Form Modal
 * Version: 2.0.1
 * Last Modified: 2025-03-28
 * 
 * Optimizations:
 * - Fixed modal visibility when maximizing
 * - Added state logging for debugging
 * - Improved animation timing
 * - Fixed transition bugs and edge cases
 * - HTTP/2 optimized with efficient DOM manipulation
 */
(function() {
    'use strict';
    
    // Debugging helper (will be removed in production)
    const DEBUG = false;
    function log(message, data) {
        if (DEBUG) console.log(`[Modal] ${message}`, data || '');
    }
    
    // State management
    const modalState = {
        isMinimized: true, // Start minimized
        isOpen: true,       // Modal is technically "open" but minimized
        isAnimating: false, // Track animation state to prevent bugs
        formData: {}
    };
    
    // DOM references
    let contactModal;
    let contactModalOverlay;
    let successModal;
    let errorModal;
    
    // Initialize on DOM ready with requestAnimationFrame for performance
    if (document.readyState !== 'loading') {
        window.requestAnimationFrame(init);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            window.requestAnimationFrame(init);
        });
    }
    
    function init() {
        log('Initializing modal');
        createModalElements();
        setupEventListeners();
        
        // Expose methods for external use
        window.FormModalHandler = {
            showSuccess,
            showError,
            minimize: minimizeModal,
            maximize: maximizeModal,
            toggle: toggleModalState
        };
        
        // Initialize EmailJS if available
        if (typeof emailjs !== 'undefined') {
            emailjs.init({ publicKey: "b3T2GoOXJmt08AM0y" });
        } else {
            // Retry when window loads
            window.addEventListener('load', () => {
                if (typeof emailjs !== 'undefined') {
                    emailjs.init({ publicKey: "b3T2GoOXJmt08AM0y" });
                }
            });
        }
    }
    
    function createModalElements() {
        log('Creating modal elements');
        
        // Create overlay
        contactModalOverlay = document.createElement('div');
        contactModalOverlay.className = 'modal-overlay';
        document.body.appendChild(contactModalOverlay);
        
        // Create contact modal in minimized state
        contactModal = document.createElement('div');
        contactModal.className = 'modal minimized';
        contactModal.id = 'contact-modal';
        contactModal.setAttribute('role', 'dialog');
        contactModal.setAttribute('aria-labelledby', 'modal-title');
        contactModal.style.display = 'block'; // Ensure visibility
        
        // Modal header and body
        contactModal.innerHTML = `
            <div class="modal-header">
                <h3 id="modal-title" class="modal-title">Contact Us</h3>
                <div class="modal-controls">
                    <button type="button" class="minimize-modal" aria-label="Toggle form" title="Maximize form">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                </div>
            </div>
            <div class="modal-body">
                <form id="modal-contact-form" class="modal-form" novalidate>
                    <input type="hidden" name="time" id="form_time" value="${new Date().toLocaleString('en-US')}">
                    
                    <!-- Row 1: Name + Email (both required) -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">Full Name <span class="required">*</span></label>
                            <input type="text" id="name" name="name" required autocomplete="name">
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address <span class="required">*</span></label>
                            <input type="email" id="email" name="email" required autocomplete="email">
                        </div>
                    </div>
                    
                    <!-- Row 2: Phone + Guest Count -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" autocomplete="tel">
                        </div>
                        <div class="form-group">
                            <label for="guests">Guest Count</label>
                            <input type="number" id="guests" name="guests" min="1">
                        </div>
                    </div>
                    
                    <!-- Row 3: Event Date + Event Type -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="event-date">Preferred Event Date</label>
                            <input type="date" id="event-date" name="event-date">
                        </div>
                        <div class="form-group">
                            <label for="event-type">Event Type</label>
                            <select id="event-type" name="event-type">
                                <option value="" selected disabled>Select event type...</option>
                                <option value="wedding">Wedding</option>
                                <option value="quinceanera">Quinceañera</option>
                                <option value="corporate">Corporate Event</option>
                                <option value="birthday">Birthday Party</option>
                                <option value="anniversary">Anniversary</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Row 4: Message (full width) -->
                    <div class="form-group full-width">
                        <label for="message">Message <span class="required">*</span></label>
                        <textarea id="message" name="message" required rows="4"></textarea>
                    </div>
                    
                    <!-- Button row with Submit and Reset -->
                    <div class="button-row">
                        <button type="button" class="reset-button" id="form-reset">Start Over</button>
                        <button type="submit" class="submit-button">Submit Inquiry</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(contactModal);
        
        // Create success modal
        successModal = document.createElement('div');
        successModal.className = 'feedback-modal';
        successModal.id = 'success-modal';
        successModal.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. A member of our team will be in touch with you shortly.</p>
            <button type="button" class="btn btn-primary close-feedback">Close</button>
        `;
        document.body.appendChild(successModal);
        
        // Create error modal
        errorModal = document.createElement('div');
        errorModal.className = 'feedback-modal';
        errorModal.id = 'error-modal';
        errorModal.innerHTML = `
            <div class="error-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h3>Submission Error</h3>
            <p id="error-message">There was a problem sending your message. Please try again.</p>
            <button type="button" class="btn btn-primary close-feedback">Close</button>
        `;
        document.body.appendChild(errorModal);
    }
    
    function setupEventListeners() {
        log('Setting up event listeners');
        
        // Use event delegation for better performance
        document.addEventListener('click', function(e) {
            // Handle contact buttons
            if (e.target.closest('.btn-contact')) {
                e.preventDefault();
                maximizeModal();
            }
            
            // Toggle minimized state
            if (e.target.closest('.minimize-modal')) {
                toggleModalState();
            }
            
            // Close when clicking overlay
            if (e.target === contactModalOverlay) {
                minimizeModal();
            }
            
            // Close feedback modals
            if (e.target.closest('.close-feedback')) {
                closeFeedbackModal();
            }
            
            // Reset form button
            if (e.target.closest('#form-reset')) {
                clearForm();
            }
        });
        
        // Form submission handler
        const form = document.getElementById('modal-contact-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
            
            // Track form changes for persistence
            form.addEventListener('input', function(e) {
                if (e.target.name) {
                    modalState.formData[e.target.name] = e.target.value;
                }
            });
        }
    }
    
    function toggleModalState() {
        if (modalState.isAnimating) {
            log('Animation in progress, ignoring toggle');
            return;
        }
        
        if (modalState.isMinimized) {
            maximizeModal();
        } else {
            minimizeModal();
        }
    }
    
    function minimizeModal() {
        log('Minimizing modal');
        
        if (modalState.isAnimating) return;
        modalState.isAnimating = true;
        
        // Update classes
        contactModal.classList.add('minimized');
        contactModal.classList.remove('active');
        contactModalOverlay.classList.remove('active');
        
        // Update icon direction
        const icon = contactModal.querySelector('.minimize-modal i');
        if (icon) {
            icon.className = 'fas fa-chevron-up';
            const button = icon.closest('button');
            if (button) button.title = 'Maximize form';
        }
        
        // Update state
        modalState.isMinimized = true;
        
        // Animation complete
        setTimeout(() => {
            modalState.isAnimating = false;
        }, 400); // Match transition duration
    }
    
    function maximizeModal() {
        log('Maximizing modal');
        
        if (modalState.isAnimating) return;
        modalState.isAnimating = true;
        
        // Critical - first add active class before removing minimized
        contactModalOverlay.classList.add('active');
        contactModal.classList.add('active');
        
        // Force a reflow to ensure active class is applied before removing minimized
        // This is a critical fix for the visibility issue
        contactModal.offsetHeight;
        
        // Remove minimized class to start animation
        contactModal.classList.remove('minimized');
        
        // Update icon direction
        const icon = contactModal.querySelector('.minimize-modal i');
        if (icon) {
            icon.className = 'fas fa-minus';
            const button = icon.closest('button');
            if (button) button.title = 'Minimize form';
        }
        
        // Update state
        modalState.isMinimized = false;
        
        // Restore saved form data
        restoreFormData();
        
        // Animation complete
        setTimeout(() => {
            modalState.isAnimating = false;
            // Focus first input field
            const firstInput = contactModal.querySelector('input[name="name"]');
            if (firstInput) firstInput.focus();
        }, 400); // Match transition duration
    }
    
    function restoreFormData() {
        const form = document.getElementById('modal-contact-form');
        if (!form || Object.keys(modalState.formData).length === 0) return;
        
        Object.entries(modalState.formData).forEach(([name, value]) => {
            const input = form.elements[name];
            if (input && name !== 'time') {
                input.value = value;
            }
        });
    }
    
    function clearForm() {
        log('Clearing form');
        
        const form = document.getElementById('modal-contact-form');
        if (!form) return;
        
        // Reset form fields
        form.reset();
        
        // Clear saved data
        modalState.formData = {};
        
        // Reset validation errors
        const errorElements = form.querySelectorAll('.has-error');
        errorElements.forEach(el => el.classList.remove('has-error'));
        
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.remove());
        
        // Reset timestamp
        const timeField = document.getElementById('form_time');
        if (timeField) timeField.value = new Date().toLocaleString('en-US');
        
        // Focus on first field
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.focus();
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        log('Form submitted');
        
        // Validate form
        if (!validateForm(this)) {
            log('Form validation failed');
            return;
        }
        
        // Update button state
        const submitBtn = this.querySelector('.submit-button');
        const resetBtn = this.querySelector('.reset-button');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        resetBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
        
        // Get form data
        const formData = new FormData(this);
        const params = {};
        
        formData.forEach((value, key) => {
            params[key] = value || (key === 'time' ? new Date().toLocaleString('en-US') : 'Not provided');
        });
        
        // Prepare EmailJS parameters
        const emailParams = {
            user_name: params.name,
            user_email: params.email,
            user_phone: params.phone || 'Not provided',
            event_type: params['event-type'] || 'Not specified',
            event_date: params['event-date'] || 'Not specified',
            guests: params.guests || 'Not specified',
            message: params.message,
            time: params.time
        };
        
        log('Sending email with params', emailParams);
        
        // Send with EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.send('service_vkdsa6d', 'template_q9f1rn2', emailParams)
                .then(function() {
                    log('Email sent successfully');
                    showSuccess();
                    clearForm();
                })
                .catch(function(error) {
                    console.error('EmailJS error:', error);
                    showError('There was a problem sending your message. Please try again or contact us directly at (480) 123-4567.');
                })
                .finally(function() {
                    // Reset button states
                    submitBtn.disabled = false;
                    resetBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                });
        } else {
            // Fallback if EmailJS is not available
            log('EmailJS not available, simulating success');
            setTimeout(() => {
                // Simulate success for testing
                showSuccess();
                clearForm();
                
                submitBtn.disabled = false;
                resetBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            }, 1500);
        }
    }
    
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        // Clear previous errors
        const errorElements = form.querySelectorAll('.has-error');
        errorElements.forEach(el => el.classList.remove('has-error'));
        
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.remove());
        
        // Check each required field
        requiredFields.forEach(field => {
            const fieldGroup = field.closest('.form-group');
            
            if (!field.value.trim()) {
                fieldGroup.classList.add('has-error');
                isValid = false;
                
                // Add error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                fieldGroup.appendChild(errorMsg);
            } else if (field.type === 'email' && !validateEmail(field.value)) {
                fieldGroup.classList.add('has-error');
                isValid = false;
                
                // Add error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                fieldGroup.appendChild(errorMsg);
            }
        });
        
        // Focus first error field if validation failed
        if (!isValid) {
            const firstErrorField = form.querySelector('.has-error input, .has-error textarea, .has-error select');
            if (firstErrorField) firstErrorField.focus();
        }
        
        return isValid;
    }
    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showSuccess() {
        log('Showing success modal');
        successModal.classList.add('active');
        contactModalOverlay.classList.add('active');
        minimizeModal();
    }
    
    function showError(message) {
        log('Showing error modal', message);
        // Set error message
        const errorMessageEl = document.getElementById('error-message');
        if (errorMessageEl) {
            errorMessageEl.textContent = message || 'There was a problem sending your message. Please try again.';
        }
        
        errorModal.classList.add('active');
        contactModalOverlay.classList.add('active');
    }
    
    function closeFeedbackModal() {
        log('Closing feedback modal');
        successModal.classList.remove('active');
        errorModal.classList.remove('active');
        contactModalOverlay.classList.remove('active');
    }
})();