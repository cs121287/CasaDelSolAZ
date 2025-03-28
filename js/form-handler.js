/**
 * Contact Form Handler with EmailJS Integration
 * Casa Del Sol AZ | 2025-03-28 15:29:04
 * Optimized for HTTP/2 and cross-browser compatibility
 */
(function() {
  'use strict';
  
  // Global FormModalHandler for communication with modal.js
  window.FormModalHandler = {
    showSuccess: function() {
      // To be implemented by modal.js
    },
    showError: function(message) {
      // To be implemented by modal.js
    }
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with updated key
    if (typeof emailjs !== 'undefined') {
      emailjs.init({
        publicKey: "LsO58YvEzZmXTSZ2q" // Updated key
      });
    } else {
      // Dynamically load EmailJS if not available
      loadEmailJS().then(() => {
        emailjs.init({
          publicKey: "LsO58YvEzZmXTSZ2q" // Updated key
        });
      });
    }
    
    // Polyfill for Element.closest
    if (!Element.prototype.closest) {
      Element.prototype.closest = function(s) {
        let el = this;
        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
    
    // Handle form submissions
    document.addEventListener('submit', function(e) {
      if (e.target.id === 'modal-contact-form') {
        e.preventDefault();
        handleFormSubmit(e.target);
      }
    });
    
    // Initialize form effects
    window.FormModalHandler.initFormEffects = initFormEffects;
    
    // Main form submission handler
    function handleFormSubmit(form) {
      // Validate form
      if (!validateForm(form)) return;
      
      // Update button state
      const submitBtn = form.querySelector('.submit-button');
      const resetBtn = form.querySelector('.reset-button') || null;
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      if (resetBtn) resetBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
      
      // Mark form as being processed
      form.classList.add('form-sent');
      
      // Get form time or create a new timestamp
      const formTime = document.getElementById('form_time');
      const timestamp = formTime ? formTime.value : new Date().toLocaleString('en-US');
      
      // Prepare form data for EmailJS
      const params = {
        user_name: form.querySelector('[name="name"]').value,
        user_email: form.querySelector('[name="email"]').value,
        user_phone: form.querySelector('[name="phone"]') ? form.querySelector('[name="phone"]').value : 'Not provided',
        event_type: form.querySelector('[name="event-type"]') ? form.querySelector('[name="event-type"]').value : 'Not specified',
        event_date: form.querySelector('[name="event-date"]') ? form.querySelector('[name="event-date"]').value : 'Not specified',
        guests: form.querySelector('[name="guests"]') ? form.querySelector('[name="guests"]').value : 'Not specified',
        message: form.querySelector('[name="message"]').value,
        time: timestamp
      };
      
      // Send with EmailJS
      emailjs.send('service_vkdsa6d', 'template_q9f1rn2', params)
        .then(function() {
          // Success handling
          if (window.FormModalHandler && typeof window.FormModalHandler.showSuccess === 'function') {
            window.FormModalHandler.showSuccess();
          } else {
            alert('Thank you! Your message has been sent.');
          }
          
          // Reset form
          form.reset();
          form.classList.remove('form-sent');
          
          // Reset field states
          const formGroups = form.querySelectorAll('.form-group');
          formGroups.forEach(group => {
            if (group) {
              group.classList.remove('has-value', 'focused', 'has-error');
              const errorMsg = group.querySelector('.error-message');
              if (errorMsg) errorMsg.remove();
            }
          });
          
          // Reset timestamp
          if (formTime) formTime.value = new Date().toLocaleString('en-US');
        })
        .catch(function(error) {
          console.error('EmailJS error:', error);
          
          // Reset form sent state
          form.classList.remove('form-sent');
          
          // Show error modal or alert
          if (window.FormModalHandler && typeof window.FormModalHandler.showError === 'function') {
            window.FormModalHandler.showError('There was a problem sending your message. Please try again or contact us directly at (480) 123-4567.');
          } else {
            alert('There was a problem sending your message. Please try again or contact us directly at (480) 123-4567.');
          }
        })
        .finally(function() {
          // Reset button states
          submitBtn.disabled = false;
          if (resetBtn) resetBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        });
    }
    
    // Helper function to load EmailJS dynamically
    function loadEmailJS() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.emailjs.com/dist/email.min.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
    
    // Form validation function
    function validateForm(form) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      // Remove existing error messages first
      const existingErrors = form.querySelectorAll('.error-message');
      existingErrors.forEach(error => {
        if (error && error.parentNode) {
          error.parentNode.removeChild(error);
        }
      });
      
      // Check each required field
      for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        const fieldGroup = field.parentElement;
        
        if (!field.value.trim()) {
          if (fieldGroup) {
            fieldGroup.classList.add('has-error');
          }
          isValid = false;
          
          // Add error message if needed
          if (fieldGroup && !fieldGroup.querySelector('.error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            fieldGroup.appendChild(errorMsg);
          }
        } else {
          if (fieldGroup) {
            fieldGroup.classList.remove('has-error');
          }
          
          // Email validation
          if (field.type === 'email' && !validateEmail(field.value)) {
            if (fieldGroup) {
              fieldGroup.classList.add('has-error');
            }
            isValid = false;
            
            if (fieldGroup && !fieldGroup.querySelector('.error-message')) {
              const errorMsg = document.createElement('div');
              errorMsg.className = 'error-message';
              errorMsg.textContent = 'Please enter a valid email address';
              fieldGroup.appendChild(errorMsg);
            }
          }
        }
      }
      
      if (!isValid) {
        // Focus first invalid field
        const firstError = form.querySelector('.has-error input, .has-error textarea');
        if (firstError) {
          firstError.focus();
          
          // Scroll to the error if needed
          const rect = firstError.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > window.innerHeight) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
      
      return isValid;
    }
    
    // Email validation helper
    function validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    
    // Form effects initialization
    function initFormEffects() {
      const inputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
      
      // Initialize each input field
      inputs.forEach(input => {
        // Set initial class based on value
        if (input && input.value) {
          const parent = input.parentElement;
          if (parent) {
            parent.classList.add('has-value');
          }
        }
        
        // Focus event
        input.addEventListener('focus', function() {
          const parent = this.parentElement;
          if (parent) {
            parent.classList.add('focused');
          }
        });
        
        // Blur event with compatibility fix
        input.addEventListener('blur', function() {
          const parent = this.parentElement;
          if (!parent) return;
          
          parent.classList.remove('focused');
          
          if (this.value) {
            parent.classList.add('has-value');
          } else {
            parent.classList.remove('has-value');
          }
          
          // Live validation
          if (this.hasAttribute('required')) {
            if (!this.value.trim()) {
              parent.classList.add('has-error');
              
              if (!parent.querySelector('.error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                parent.appendChild(errorMsg);
              }
            } else {
              parent.classList.remove('has-error');
              const errorMsg = parent.querySelector('.error-message');
              if (errorMsg && errorMsg.parentNode) {
                errorMsg.parentNode.removeChild(errorMsg);
              }
              
              // Email validation
              if (this.type === 'email' && !validateEmail(this.value)) {
                parent.classList.add('has-error');
                
                if (!parent.querySelector('.error-message')) {
                  const errorMsg = document.createElement('div');
                  errorMsg.className = 'error-message';
                  errorMsg.textContent = 'Please enter a valid email address';
                  parent.appendChild(errorMsg);
                }
              }
            }
          }
        });
      });
    }
  });
})();