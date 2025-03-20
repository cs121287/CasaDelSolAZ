/**
 * EmailJS Debug Helper - Remove after fixing issues
 * For CasaDelSolAZ contact form
 */
console.log('Debug helper loaded');

// Check if EmailJS is initialized
window.addEventListener('load', function() {
  if (window.emailjs) {
    console.log('EmailJS is loaded successfully');
    
    // Test connection to EmailJS
    fetch('https://api.emailjs.com/api/v1.0/email/test')
      .then(response => {
        console.log('EmailJS API test response status:', response.status);
        return response.text();
      })
      .then(data => {
        console.log('EmailJS API test response:', data);
      })
      .catch(error => {
        console.error('EmailJS API test failed:', error);
      });
  } else {
    console.error('EmailJS failed to load');
  }
  
  // Check if form exists and has all required fields
  const form = document.getElementById('contactForm');
  if (form) {
    console.log('Contact form found');
    ['name', 'email', 'message', 'event-type', 'event-date', 'guests'].forEach(field => {
      const element = document.getElementById(field);
      console.log(`Field ${field} exists:`, !!element);
    });
  } else {
    console.error('Contact form not found');
  }
});