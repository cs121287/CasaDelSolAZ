/**
 * Form Validation & Input Formatting Module
 * CasaDelSolAZ - Version 1.0.2
 * Last Modified: 2025-03-28 13:19:08
 * 
 * Features:
 * - Automatic phone number formatting (555) 555-1212
 * - Guest count numeric validation
 * - Performance optimized with passive event listeners
 * - HTTP/2 optimization ready
 */
(function() {
  'use strict';
  
  // Initialize when DOM is ready using requestIdleCallback for non-critical tasks
  if (document.readyState !== 'loading') {
    window.requestIdleCallback ? 
      window.requestIdleCallback(init, {timeout: 1000}) : setTimeout(init, 100);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      window.requestIdleCallback ? 
        window.requestIdleCallback(init, {timeout: 1000}) : setTimeout(init, 100);
    });
  }
  
  function init() {
    // Use event delegation for better performance
    document.addEventListener('input', handleInputEvent, { passive: true });
    document.addEventListener('focus', handleFocusEvent, { passive: true, capture: true });
    document.addEventListener('blur', handleBlurEvent, { passive: true });
    
    // Initialize any existing form fields
    initializeFormFields();
  }
  
  function initializeFormFields() {
    // Find phone fields
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
    phoneInputs.forEach(input => {
      // Format existing values
      if (input.value) {
        input.value = formatPhoneNumber(input.value);
      }
      
      // Add data attribute for identification
      input.dataset.formatType = 'phone';
    });
    
    // Find guest count fields
    const guestInputs = document.querySelectorAll('input[name="guests"]');
    guestInputs.forEach(input => {
      input.setAttribute('inputmode', 'numeric');
      input.dataset.formatType = 'number';
      
      // Set proper constraints
      input.min = '1';
      input.max = '1000';
    });
  }
  
  function handleInputEvent(e) {
    const input = e.target;
    
    // Phone number formatting
    if (input.dataset.formatType === 'phone' || 
        input.name === 'phone' || 
        input.type === 'tel') {
      
      const cursorPos = input.selectionStart;
      const oldLength = input.value.length;
      
      // Format the phone number
      input.value = formatPhoneNumber(input.value);
      
      // Adjust cursor position after formatting
      const newLength = input.value.length;
      const cursorAdjustment = newLength - oldLength;
      
      if (cursorPos + cursorAdjustment > 0) {
        input.setSelectionRange(cursorPos + cursorAdjustment, cursorPos + cursorAdjustment);
      }
    }
    
    // Guest count validation - ensure numbers only
    if (input.dataset.formatType === 'number' || input.name === 'guests') {
      // Remove non-numeric characters
      const numericValue = input.value.replace(/[^0-9]/g, '');
      
      // Only update if changed to avoid unnecessary reflow
      if (numericValue !== input.value) {
        input.value = numericValue;
      }
    }
  }
  
  function handleFocusEvent(e) {
    const input = e.target;
    
    // Mark parent form group as focused for styling
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('focused');
    }
  }
  
  function handleBlurEvent(e) {
    const input = e.target;
    
    // Remove focus class
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('focused');
      
      // Add has-value class if input has value
      if (input.value.trim()) {
        formGroup.classList.add('has-value');
      } else {
        formGroup.classList.remove('has-value');
      }
    }
  }
  
  function formatPhoneNumber(value) {
    // Strip all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 0) {
      return '';
    } else if (cleaned.length <= 3) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  }
  
  // Expose API for external use
  window.FormValidator = {
    formatPhoneNumber,
    initializeFormFields
  };
})();