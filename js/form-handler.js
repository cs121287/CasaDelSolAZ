/**
 * Contact Form Handler with EmailJS Integration
 * Casa Del Sol AZ | 2025
 * Optimized for performance with modal feedback
 */
(function() {
  'use strict';
  
  // Global FormModalHandler for communication with modal.js
  window.FormModalHandler = {
    showSuccess: function() {
      // Show success feedback - implemented in modal.js
    },
    showError: function(message) {
      // Show error feedback - implemented in modal.js
    }
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS when DOM is ready
    if (typeof emailjs !== 'undefined') {
      emailjs.init({
        publicKey: "b3T2GoOXJmt08AM0y"
      });
    } else {
      // EmailJS library not available, wait for it to load
      window.addEventListener('load', function() {
        if (typeof emailjs !== 'undefined') {
          emailjs.init({
            publicKey: "b3T2GoOXJmt08AM0y"
          });
        } else {
          console.warn('EmailJS library not loaded');
        }
      });
    }
    
    // The form will be cloned into the modal, so we set up a global listener
    document.addEventListener('submit', function(e) {
      // Check if the submitted form is a contact form
      if (e.target.id === 'modal-contact-form') {
        e.preventDefault();
        handleFormSubmit(e.target);
      }
    });
    
    // Initialize form effects for any forms added to the DOM
    // This will be called by modal.js when the form is added to the modal
    window.FormModalHandler.initFormEffects = initFormEffects;
    
    // Main form submission handler
    function handleFormSubmit(form) {
      // Validate form
      if (!validateForm(form)) return;
      
      // Update button state
      const submitBtn = form.querySelector('button[type="submit"]');
      const buttonText = submitBtn.querySelector('.button-text') || submitBtn;
      const buttonIcon = submitBtn.querySelector('.button-icon') || submitBtn;
      const originalButtonContent = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      if (buttonText.textContent) buttonText.textContent = 'Sending...';
      if (buttonIcon.innerHTML) buttonIcon.innerHTML = '<span class="spinner"></span>';
      else submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';
      
      // Mark form as being processed
      form.classList.add('form-sent');
      
      // Get form time or create a new timestamp
      const formTime = document.getElementById('form_time');
      const timestamp = formTime ? formTime.value : new Date().toLocaleString('en-US');
      
      // Prepare form data for EmailJS
      const params = {
        user_name: form.querySelector('[name="name"]').value,
        user_email: form.querySelector('[name="email"]').value,
        user_phone: form.querySelector('[name="phone"]').value || 'Not provided',
        event_type: form.querySelector('[name="event-type"]').value || 'Not specified',
        event_date: form.querySelector('[name="event-date"]').value || 'Not specified',
        guests: form.querySelector('[name="guests"]').value || 'Not specified',
        message: form.querySelector('[name="message"]').value,
        time: timestamp
      };
      
      // Send with EmailJS using Promise-based approach for better performance
      if (typeof emailjs !== 'undefined') {
        emailjs.send('service_vkdsa6d', 'template_q9f1rn2', params)
          .then(function() {
            // Success callback
            if (window.FormModalHandler && typeof window.FormModalHandler.showSuccess === 'function') {
              window.FormModalHandler.showSuccess();
            }
            
            // Reset form
            form.reset();
            form.classList.remove('form-sent');
            
            // Reset all field states
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
              group.classList.remove('has-value', 'focused', 'has-error');
              const errorMsg = group.querySelector('.error-message');
              if (errorMsg) errorMsg.remove();
            });
            
            // Reset the timestamp field
            if (formTime) formTime.value = new Date().toLocaleString('en-US');
          })
          .catch(function(error) {
            console.error('EmailJS error:', error);
            
            // Reset form sent state
            form.classList.remove('form-sent');
            
            // Show error modal
            if (window.FormModalHandler && typeof window.FormModalHandler.showError === 'function') {
              window.FormModalHandler.showError('There was a problem sending your message. Please try again or contact us directly at (480) 123-4567.');
            } else {
              alert('There was a problem sending your message. Please try again or contact us directly at (480) 123-4567.');
            }
          })
          .finally(function() {
            // Reset button state regardless of outcome
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButtonContent;
          });
      } else {
        // EmailJS not available
        console.error('EmailJS library not loaded');
        
        // Reset form sent state
        form.classList.remove('form-sent');
        
        // Show error modal
        if (window.FormModalHandler && typeof window.FormModalHandler.showError === 'function') {
          window.FormModalHandler.showError('There was a problem with the form submission service. Please try again later or contact us directly at (480) 123-4567.');
        } else {
          alert('There was a problem with the form submission service. Please try again later or contact us directly at (480) 123-4567.');
        }
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonContent;
      }
    }
    
    // Form validation function
    function validateForm(form) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      // Remove any existing error messages first for clean validation
      const existingErrors = form.querySelectorAll('.error-message');
      existingErrors.forEach(error => error.remove());
      
      // Check each required field
      for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        const fieldGroup = field.closest('.form-group');
        
        if (!field.value.trim()) {
          fieldGroup.classList.add('has-error');
          isValid = false;
          
          // Add error message if needed
          if (!fieldGroup.querySelector('.error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            fieldGroup.appendChild(errorMsg);
          }
        } else {
          fieldGroup.classList.remove('has-error');
          
          // Additional validation for email
          if (field.type === 'email' && !validateEmail(field.value)) {
            fieldGroup.classList.add('has-error');
            isValid = false;
            
            if (!fieldGroup.querySelector('.error-message')) {
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
          
          // Smoothly scroll to the error if needed
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
    
    // Initialize form effects
    function initFormEffects(form) {
      if (!form) return;
      
      const inputs = form.querySelectorAll('input, textarea, select');
      
      // Set initial state for inputs with values
      inputs.forEach(input => {
        // Set initial has-value class
        if (input.value) {
          input.parentElement.classList.add('has-value');
        }
        
        // Focus event
        input.addEventListener('focus', function() {
          this.parentElement.classList.add('focused');
        });
        
        // Blur event
        input.addEventListener('blur', function() {
          this.parentElement.classList.remove('focused');
          
          if (this.value) {
            this.parentElement.classList.add('has-value');
          } else {
            this.parentElement.classList.remove('has-value');
          }
          
          // Live validation for required fields
          if (this.hasAttribute('required')) {
            const fieldGroup = this.closest('.form-group');
            
            if (!this.value.trim()) {
              fieldGroup.classList.add('has-error');
              
              if (!fieldGroup.querySelector('.error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                fieldGroup.appendChild(errorMsg);
              }
            } else {
              fieldGroup.classList.remove('has-error');
              const errorMsg = fieldGroup.querySelector('.error-message');
              if (errorMsg) errorMsg.remove();
              
              // Email validation
              if (this.type === 'email' && !validateEmail(this.value)) {
                fieldGroup.classList.add('has-error');
                
                if (!fieldGroup.querySelector('.error-message')) {
                  const errorMsg = document.createElement('div');
                  errorMsg.className = 'error-message';
                  errorMsg.textContent = 'Please enter a valid email address';
                  fieldGroup.appendChild(errorMsg);
                }
              }
            }
          }
        });
        
        // Input validation - clear errors as user types
        input.addEventListener('input', function() {
          if (this.hasAttribute('required') || this.type === 'email') {
            const fieldGroup = this.closest('.form-group');
            
            if ((this.hasAttribute('required') && this.value.trim()) || 
                (this.type === 'email' && validateEmail(this.value))) {
              fieldGroup.classList.remove('has-error');
              const errorMsg = fieldGroup.querySelector('.error-message');
              if (errorMsg) errorMsg.remove();
            }
          }
        });
      });
      
      // Special handling for date inputs
      const dateInput = form.querySelector('input[type="date"]');
      if (dateInput) {
        const dateContainer = dateInput.closest('.form-group');
        
        // Set initial state if date has value
        if (dateInput.value) {
          dateContainer.classList.add('has-value');
        }
        
        // Add change event listener
        dateInput.addEventListener('change', function() {
          if (this.value) {
            dateContainer.classList.add('has-value');
          } else {
            dateContainer.classList.remove('has-value');
          }
        });
      }
      
      // Special handling for select inputs
      const selectInput = form.querySelector('select');
      if (selectInput) {
        const selectContainer = selectInput.closest('.form-group');
        
        // Set initial state if select has value
        if (selectInput.value && selectInput.value !== '') {
          selectContainer.classList.add('has-value');
        }
        
        // Add change event listener
        selectInput.addEventListener('change', function() {
          if (this.value && this.value !== '') {
            selectContainer.classList.add('has-value');
          } else {
            selectContainer.classList.remove('has-value');
          }
        });
      }
      
      // Initialize time field
      const formTime = form.querySelector('#form_time');
      if (formTime) {
        formTime.value = new Date().toLocaleString('en-US');
      }
    }
  });
})();