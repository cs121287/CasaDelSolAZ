/**
 * Casa Del Sol AZ - Form Effects
 * Version: 2.0.1
 * Enhances form interaction with animations and validations
 */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const formGroups = contactForm.querySelectorAll('.form-group');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetForm');
    
    // Initialize floating labels
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');
        
        if (!input || !label) return;
        
        // Skip special handling for date and select inputs
        if (group.classList.contains('date-input') || group.classList.contains('select-input')) {
            // Special logic for select fields
            if (input.tagName === 'SELECT') {
                input.addEventListener('change', function() {
                    if (this.value) {
                        group.classList.add('has-value');
                    } else {
                        group.classList.remove('has-value');
                    }
                });
            }
            
            // We still want to track focus state
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                group.classList.remove('focused');
                if (input.value) {
                    group.classList.add('has-value');
                } else {
                    group.classList.remove('has-value');
                }
            });
            
            // Set initial state
            if (input.value) {
                group.classList.add('has-value');
            }
            
            return;
        }
        
        // Set initial state if value exists
        if (input.value.trim() !== '') {
            group.classList.add('has-value');
        }
        
        // Focus events
        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });
        
        // Blur events
        input.addEventListener('blur', () => {
            group.classList.remove('focused');
            
            if (input.value.trim() !== '') {
                group.classList.add('has-value');
            } else {
                group.classList.remove('has-value');
            }
        });
        
        // Input validation
        if (input.hasAttribute('required')) {
            input.addEventListener('input', validateInput);
            input.addEventListener('blur', validateInput);
        }
    });
    
    // Validate form inputs
    function validateInput() {
        const input = this;
        const group = input.closest('.form-group');
        
        if (input.validity.valueMissing) {
            showError(input, group, 'This field is required');
        } else if (input.validity.typeMismatch && input.type === 'email') {
            showError(input, group, 'Please enter a valid email address');
        } else {
            clearError(input, group);
        }
    }
    
    // Show error message
    function showError(input, group, message) {
        group.classList.add('has-error');
        
        // Create or update error message
        let errorMsg = group.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            group.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        input.setAttribute('aria-invalid', 'true');
    }
    
    // Clear error message
    function clearError(input, group) {
        group.classList.remove('has-error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
        input.setAttribute('aria-invalid', 'false');
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check form validity
            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }
            
            // Show loading state
            submitButton.innerHTML = '<span class="spinner"></span> Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('submitting');
            
            // Simulate form submission (in a real scenario, you'd send data to server)
            setTimeout(() => {
                contactForm.style.opacity = '0';
                contactForm.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.classList.remove('hidden');
                        formSuccess.style.opacity = '0';
                        formSuccess.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            formSuccess.style.opacity = '1';
                            formSuccess.style.transform = 'translateY(0)';
                        }, 50);
                    }
                }, 300);
            }, 1500);
        });
    }
    
    // Reset form button
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            contactForm.reset();
            contactForm.style.display = 'block';
            contactForm.style.opacity = '1';
            contactForm.style.transform = 'translateY(0)';
            submitButton.innerHTML = 'Submit Inquiry';
            submitButton.disabled = false;
            submitButton.classList.remove('submitting');
            
            // Reset all form groups
            formGroups.forEach(group => {
                group.classList.remove('has-value', 'has-error', 'focused');
                const errorMsg = group.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
            
            if (formSuccess) {
                formSuccess.classList.add('hidden');
            }
        });
    }
    
    // Scroll to form when clicking the CTA button
    const scrollToFormBtn = document.querySelector('.scroll-to-form');
    if (scrollToFormBtn) {
        scrollToFormBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const formElement = document.querySelector('#contactForm');
            if (formElement) {
                formElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Initialize FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                this.classList.toggle('active');
                const answer = this.nextElementSibling;
                
                if (this.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0px';
                }
            });
        });
    }
});