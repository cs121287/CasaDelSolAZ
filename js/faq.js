/**
 * FAQ functionality for CasaDelSolAZ
 * Optimized for performance with event delegation and minimal DOM operations
 */
document.addEventListener('DOMContentLoaded', function() {
  // Use event delegation for better performance
  const faqContainer = document.querySelector('.faq-container');
  
  if (faqContainer) {
    faqContainer.addEventListener('click', function(event) {
      // Find the closest faq-question button if the click was on or within it
      const faqQuestion = event.target.closest('.faq-question');
      
      if (faqQuestion) {
        // Toggle active class on the question
        faqQuestion.classList.toggle('active');
        
        // Get the corresponding answer
        const faqAnswer = faqQuestion.nextElementSibling;
        
        // Toggle the answer visibility
        if (faqQuestion.classList.contains('active')) {
          faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
        } else {
          faqAnswer.style.maxHeight = '0';
        }
      }
    });
  }
  
  // Pre-populate service field on contact form if coming from a service link
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  
  if (serviceParam) {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
      // Format the service parameter to match option values
      const formattedService = serviceParam.replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Find and select the matching option
      Array.from(serviceSelect.options).forEach(option => {
        if (option.text.includes(formattedService)) {
          option.selected = true;
        }
      });
      
      // Scroll to contact form
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
});