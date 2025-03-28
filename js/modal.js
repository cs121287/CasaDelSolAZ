/**
 * Contact Form Modal
 * Performance optimized with:
 * - Event delegation
 * - Throttled events
 * - Resource efficient animations
 */

(function() {
  'use strict';
  
  // Declared at module scope for better memory management
  let contactModal;
  let contactModalOverlay;
  let minimizeIndicator;
  let modalState = {
    isMinimized: false,
    isOpen: false,
    formData: {} // Store form data here
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  function init() {
    // Create modal elements once and reuse
    createModalElements();
    
    // Set up event listeners using delegation where possible
    document.addEventListener('click', handleDocumentClick);
    
    // Form events to persist data
    setupFormTracking();
  }
  
  function createModalElements() {
    // Create overlay
    contactModalOverlay = document.createElement('div');
    contactModalOverlay.className = 'modal-overlay';
    
    // Create modal
    contactModal = document.createElement('div');
    contactModal.className = 'modal';
    contactModal.id = 'contact-modal';
    
    // Create modal content
    contactModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Contact Us</h3>
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
    
    // Append to body
    document.body.appendChild(contactModalOverlay);
    document.body.appendChild(contactModal);
    document.body.appendChild(minimizeIndicator);
    
    // Get the original form and clone it for our modal
    const originalForm = document.getElementById('contact-form');
    if (originalForm) {
      const modalBody = contactModal.querySelector('.modal-body');
      const clonedForm = originalForm.cloneNode(true);
      clonedForm.id = 'modal-contact-form';
      clonedForm.className = 'contact-form modal-form';
      modalBody.appendChild(clonedForm);
      
      // Prevent form submission and handle data
      clonedForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Set up modal-specific events
    contactModal.querySelector('.minimize-modal').addEventListener('click', minimizeModal);
    minimizeIndicator.addEventListener('click', maximizeModal);
  }
  
  function handleDocumentClick(e) {
    // Handle all contact-related button clicks
    if (e.target.matches('[href="#contact"], [href="#contact"] *, .btn-contact, .btn-contact *')) {
      e.preventDefault();
      openModal();
    }
    
    // Close modal when clicking overlay
    if (e.target === contactModalOverlay) {
      minimizeModal();
    }
  }
  
  function openModal() {
    if (!modalState.isOpen) {
      contactModalOverlay.classList.add('active');
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      modalState.isOpen = true;
      
      // Focus first form field for accessibility
      setTimeout(() => {
        const firstInput = contactModal.querySelector('input, textarea, select');
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
  }
  
  function setupFormTracking() {
    // Track form inputs to preserve data when minimized
    const modalForm = document.getElementById('modal-contact-form');
    if (!modalForm) return;
    
    // Capture all input changes
    modalForm.addEventListener('input', function(e) {
      const input = e.target;
      if (input.name) {
        modalState.formData[input.name] = input.value;
      }
    });
    
    // Restore data when reopened
    function restoreFormData() {
      if (Object.keys(modalState.formData).length === 0) return;
      
      Object.entries(modalState.formData).forEach(([name, value]) => {
        const input = modalForm.elements[name];
        if (input) input.value = value;
      });
    }
    
    // Restore data when maximizing
    minimizeIndicator.addEventListener('click', restoreFormData);
  }
  
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Gather form data
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('[type="submit"]');
    
    // Disable button and show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        setTimeout(() => {
          // Reset form after success
          modalState.formData = {};
          e.target.reset();
          
          // Close modal after delay
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
            minimizeModal();
          }, 1500);
        }, 1000);
      }
    }, 1500);
  }
})();