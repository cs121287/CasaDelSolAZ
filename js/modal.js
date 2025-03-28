/**
 * Enhanced Contact Form Modal
 * Performance optimized with:
 * - Event delegation
 * - Throttled events
 * - Form data persistence
 * - EmailJS integration
 */

(function() {
  'use strict';
  
  // Module scope variables for better memory management
  let contactModal;
  let contactModalOverlay;
  let minimizeIndicator;
  let successModal;
  let errorModal;
  let modalState = {
    isMinimized: false,
    isOpen: false,
    formData: {} // Store form data here
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  function init() {
    // Create modal elements once
    createModalElements();
    
    // Set up event delegation for better performance
    document.addEventListener('click', handleDocumentClick);
    
    // Set up form tracking for data persistence
    setupFormTracking();
  }
  
  function createModalElements() {
    // Create overlay
    contactModalOverlay = document.createElement('div');
    contactModalOverlay.className = 'modal-overlay';
    
    // Create contact modal
    contactModal = document.createElement('div');
    contactModal.className = 'modal';
    contactModal.id = 'contact-modal';
    contactModal.setAttribute('role', 'dialog');
    contactModal.setAttribute('aria-labelledby', 'modal-title');
    
    // Create modal content with header and body
    contactModal.innerHTML = `
      <div class="modal-header">
        <h3 id="modal-title" class="modal-title">Contact Us</h3>
        <div class="modal-controls">
          <button type="button" class="minimize-modal" aria-label="Minimize form">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="modal-body">
        <!-- Form will be inserted here -->
      </div>
    `;
    
    // Create minimize indicator
    minimizeIndicator = document.createElement('div');
    minimizeIndicator.className = 'minimize-indicator';
    minimizeIndicator.innerHTML = `<i class="fas fa-chevron-up"></i> <span>Contact Form</span>`;
    
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
    
    // Create error modal
    errorModal = document.createElement('div');
    errorModal.className = 'feedback-modal';
    errorModal.id = 'error-modal';
    errorModal.innerHTML = `
      <div class="error-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <h3>Submission Error</h3>
      <p id="error-message">There was a problem sending your message. Please try again or contact us directly.</p>
      <button type="button" class="btn btn-primary close-feedback">Close</button>
    `;
    
    // Append elements to DOM
    document.body.appendChild(contactModalOverlay);
    document.body.appendChild(contactModal);
    document.body.appendChild(minimizeIndicator);
    document.body.appendChild(successModal);
    document.body.appendChild(errorModal);
    
    // Get original form and create enhanced version
    const originalForm = document.getElementById('contact-form');
    if (originalForm) {
      const modalBody = contactModal.querySelector('.modal-body');
      const enhancedForm = createEnhancedForm(originalForm);
      modalBody.appendChild(enhancedForm);
      
      // Initialize form effects if available
      if (window.FormModalHandler && typeof window.FormModalHandler.initFormEffects === 'function') {
        window.FormModalHandler.initFormEffects(enhancedForm);
      }
    }
    
    // Set up feedback modal event listeners
    document.querySelectorAll('.close-feedback').forEach(button => {
      button.addEventListener('click', closeFeedbackModal);
    });
    
    // Set up modal-specific events
    contactModal.querySelector('.minimize-modal').addEventListener('click', minimizeModal);
    minimizeIndicator.addEventListener('click', maximizeModal);
    
    // Implement FormModalHandler methods for form-handler.js
    window.FormModalHandler.showSuccess = showSuccessModal;
    window.FormModalHandler.showError = showErrorModal;
  }
  
  function createEnhancedForm(originalForm) {
    // Create a new form with enhanced structure and floating labels
    const enhancedForm = document.createElement('form');
    enhancedForm.id = 'modal-contact-form';
    enhancedForm.className = 'contact-form modal-form';
    enhancedForm.setAttribute('novalidate', '');
    
    // Add hidden timestamp field
    const timeField = document.createElement('input');
    timeField.type = 'hidden';
    timeField.name = 'time';
    timeField.id = 'form_time';
    timeField.value = new Date().toLocaleString('en-US');
    enhancedForm.appendChild(timeField);
    
    // Name field
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    nameGroup.innerHTML = `
      <input type="text" id="modal-name" name="name" placeholder=" " required autocomplete="name">
      <label for="modal-name" class="floating-label">Full Name <span class="required">*</span></label>
      <div class="form-highlight"></div>
    `;
    enhancedForm.appendChild(nameGroup);
    
    // Email field
    const emailGroup = document.createElement('div');
    emailGroup.className = 'form-group';
    emailGroup.innerHTML = `
      <input type="email" id="modal-email" name="email" placeholder=" " required autocomplete="email">
      <label for="modal-email" class="floating-label">Email Address <span class="required">*</span></label>
      <div class="form-highlight"></div>
    `;
    enhancedForm.appendChild(emailGroup);
    
    // Phone field
    const phoneGroup = document.createElement('div');
    phoneGroup.className = 'form-group';
    phoneGroup.innerHTML = `
      <input type="tel" id="modal-phone" name="phone" placeholder=" " autocomplete="tel">
      <label for="modal-phone" class="floating-label">Phone Number</label>
      <div class="form-highlight"></div>
    `;
    enhancedForm.appendChild(phoneGroup);
    
    // Event date and type in a row
    const rowGroup = document.createElement('div');
    rowGroup.className = 'form-row';
    
    // Event date
    const dateGroup = document.createElement('div');
    dateGroup.className = 'form-group half date-input';
    dateGroup.innerHTML = `
      <label for="modal-event-date">Preferred Event Date</label>
      <input type="date" id="modal-event-date" name="event-date">
    `;
    rowGroup.appendChild(dateGroup);
    
    // Event type
    const typeGroup = document.createElement('div');
    typeGroup.className = 'form-group half select-input';
    typeGroup.innerHTML = `
      <label for="modal-event-type">Event Type</label>
      <div class="select-wrapper">
        <select id="modal-event-type" name="event-type">
          <option value="" selected>Select event type...</option>
          <option value="wedding">Wedding</option>
          <option value="quinceanera">Quinceañera</option>
          <option value="baptism">Baptism</option>
          <option value="first-communion">First Communion</option>
          <option value="corporate">Corporate Event</option>
          <option value="birthday">Birthday Party</option>
          <option value="anniversary">Anniversary</option>
          <option value="other">Other</option>
        </select>
        <div class="select-arrow">
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
    `;
    rowGroup.appendChild(typeGroup);
    enhancedForm.appendChild(rowGroup);
    
    // Guest count
    const guestGroup = document.createElement('div');
    guestGroup.className = 'form-group';
    guestGroup.innerHTML = `
      <input type="number" id="modal-guests" name="guests" placeholder=" " min="1">
      <label for="modal-guests" class="floating-label">Estimated Guest Count</label>
      <div class="form-highlight"></div>
    `;
    enhancedForm.appendChild(guestGroup);
    
    // Message field
    const messageGroup = document.createElement('div');
    messageGroup.className = 'form-group';
    messageGroup.innerHTML = `
      <textarea id="modal-message" name="message" placeholder=" " required rows="5"></textarea>
      <label for="modal-message" class="floating-label">Your Message <span class="required">*</span></label>
      <div class="form-highlight"></div>
    `;
    enhancedForm.appendChild(messageGroup);
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'submit-button';
    submitButton.innerHTML = `
      <span class="button-text">Submit Inquiry</span>
      <span class="button-icon"><i class="fas fa-paper-plane"></i></span>
    `;
    enhancedForm.appendChild(submitButton);
    
    return enhancedForm;
  }
  
  function handleDocumentClick(e) {
    // Handle all contact-related button clicks
    if (e.target.matches('.btn-contact, .btn-contact *, [href="#contact"].btn-contact, [href="#contact"].btn-contact *')) {
      e.preventDefault();
      openModal();
    }
    
    // Close modal when clicking overlay
    if (e.target === contactModalOverlay && !successModal.classList.contains('active') && !errorModal.classList.contains('active')) {
      minimizeModal();
    }
    
    // Close feedback modals when clicking overlay
    if (e.target === contactModalOverlay && 
        (successModal.classList.contains('active') || 
         errorModal.classList.contains('active'))) {
      closeFeedbackModal();
    }
  }
  
  function openModal() {
    if (!modalState.isOpen) {
      contactModalOverlay.classList.add('active');
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      modalState.isOpen = true;
      
      // Set current timestamp
      const timeField = document.getElementById('form_time');
      if (timeField) timeField.value = new Date().toLocaleString('en-US');
      
      // Focus first form field for accessibility
      setTimeout(() => {
        const firstInput = contactModal.querySelector('input[name="name"]');
        if (firstInput) firstInput.focus();
      }, 300);
    } else if (modalState.isMinimized) {
      maximizeModal();
    }
  }
  
  function minimizeModal() {
    contactModal.classList.add('minimized');
    contactModalOverlay.classList.remove('active');
    minimizeIndicator.classList.add('show');
    document.body.style.overflow = ''; // Allow scrolling again
    modalState.isMinimized = true;
  }
  
  function maximizeModal() {
    contactModal.classList.remove('minimized');
    contactModalOverlay.classList.add('active');
    minimizeIndicator.classList.remove('show');
    document.body.style.overflow = 'hidden';
    modalState.isMinimized = false;
    
    // Restore any saved form data
    restoreFormData();
  }
  
  function setupFormTracking() {
    // Use event delegation for better performance
    document.addEventListener('input', function(e) {
      const modalForm = document.getElementById('modal-contact-form');
      if (modalForm && modalForm.contains(e.target) && e.target.name) {
        modalState.formData[e.target.name] = e.target.value;
      }
    });
  }
  
  function restoreFormData() {
    const modalForm = document.getElementById('modal-contact-form');
    if (!modalForm || Object.keys(modalState.formData).length === 0) return;
    
    Object.entries(modalState.formData).forEach(([name, value]) => {
      const input = modalForm.elements[name];
      if (input && name !== 'time') {
        input.value = value;
        
        // Update has-value class for styling
        const fieldGroup = input.closest('.form-group');
        if (fieldGroup && value) {
          fieldGroup.classList.add('has-value');
        }
      }
    });
  }
  
  function showSuccessModal() {
    // Clear form data since submission was successful
    modalState.formData = {};
    modalState.isOpen = false;
    modalState.isMinimized = false;
    
    // Hide contact modal
    contactModal.classList.remove('active', 'minimized');
    minimizeIndicator.classList.remove('show');
    
    // Show success modal
    successModal.classList.add('active');
    contactModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function showErrorModal(message) {
    // Hide contact modal but keep it open
    contactModal.classList.remove('active');
    
    // Set error message
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
      errorMessageElement.textContent = message || 'There was a problem sending your message. Please try again.';
    }
    
    // Show error modal
    errorModal.classList.add('active');
    contactModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeFeedbackModal() {
    // Hide feedback modals
    successModal.classList.remove('active');
    errorModal.classList.remove('active');
    
    // If contact form had an error, show it again
    if (modalState.isOpen && !modalState.isMinimized) {
      contactModal.classList.add('active');
    } else if (modalState.isOpen && modalState.isMinimized) {
      // If it was minimized, keep it minimized
      minimizeIndicator.classList.add('show');
      contactModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      // If form was successfully submitted, hide overlay
      contactModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
})();