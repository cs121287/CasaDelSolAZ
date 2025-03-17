/**
 * Casa Del Sol AZ - FAQ Functionality
 * Version: 1.0.0
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('FAQ script loaded');
    
    // Get all FAQ questions
    const faqQuestions = document.querySelectorAll('.faq-question');
    console.log('Found ' + faqQuestions.length + ' FAQ questions');
    
    // Initialize each FAQ item
    if (faqQuestions.length > 0) {
        faqQuestions.forEach((question, index) => {
            // Set initial state for all answers (closed)
            const answer = question.nextElementSibling;
            answer.style.maxHeight = '0px';
            
            // Add click event listener
            question.addEventListener('click', function() {
                console.log('FAQ question clicked: ' + index);
                
                // Toggle active class
                this.classList.toggle('active');
                
                // Toggle answer visibility
                if (this.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0px';
                }
            });
        });
    }
});