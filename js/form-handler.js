document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        // Form submission handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show processing state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span>Processing...';
            
            // Send form data to server
            const formData = new FormData(contactForm);
            
            fetch('process-form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show success message
                contactForm.style.opacity = '0';
                contactForm.style.transform = 'translateY(-20px)';
                
                setTimeout(function() {
                    contactForm.style.display = 'none';
                    formSuccess.classList.remove('hidden');
                    
                    setTimeout(function() {
                        formSuccess.style.opacity = '1';
                        formSuccess.style.transform = 'translateY(0)';
                    }, 50);
                }, 300);
            })
            .catch(error => {
                // Handle errors
                alert('There was a problem submitting your form. Please try again later.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }
});