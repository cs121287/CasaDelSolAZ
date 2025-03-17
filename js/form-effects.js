/**
 * Casa Del Sol AZ - Interactive Form Elements
 * Enhances form interaction with animations and validations
 */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const formGroups = contactForm.querySelectorAll('.form-group');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetForm');
    
    // Label floating effect
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');
        
        if (!input || !label) return;
        
        // Add floating label class
        label.classList.add('floating-label');
        
        // Set initial state
        if (input.value.trim() !== '') {
            group.classList.add('has-value');
        }
        
        // Handle focus event
        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });
        
        // Handle blur event
        input.addEventListener('blur', () => {
            group.classList.remove('focused');
            
            if (input.value.trim() !== '') {
                group.classList.add('has-value');
            } else {
                group.classList.remove('has-value');
            }
        });
        
        // Real-time validation for required fields
        if (input.hasAttribute('required')) {
            input.addEventListener('input', validateInput);
            input.addEventListener('blur', validateInput);
        }
    });
    
    // Show validation messages using attributes
    function validateInput() {
        const input = this;
        const group = input.closest('.form-group');
        
        if (input.value.trim() === '') {
            group.classList.add('has-error');
            input.setCustomValidity('This field is required');
        } else {
            // Check specific validations by type
            if (input.type === 'email' && !isValidEmail(input.value)) {
                group.classList.add('has-error');
                input.setCustomValidity('Please enter a valid email address');
            } else {
                group.classList.remove('has-error');
                input.setCustomValidity('');
            }
        }
        
        // Show inline validation message
        const errorMsg = group.querySelector('.error-message');
        if (input.validationMessage && !errorMsg) {
            const message = document.createElement('div');
            message.className = 'error-message';
            message.textContent = input.validationMessage;
            group.appendChild(message);
        } else if (errorMsg && !input.validationMessage) {
            errorMsg.remove();
        } else if (errorMsg) {
            errorMsg.textContent = input.validationMessage;
        }
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Enhanced form submission with animation
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if form is valid
        const isValid = contactForm.checkValidity();
        if (!isValid) {
            // Trigger browser's native validation
            contactForm.reportValidity();
            return;
        }
        
        // Submit animation
        submitButton.innerHTML = '<span class="spinner"></span> Sending...';
        submitButton.disabled = true;
        submitButton.classList.add('submitting');
        
        // Simulate form submission (replace with actual AJAX in production)
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
});