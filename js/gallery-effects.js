/**
 * Casa Del Sol AZ - Gallery Image Effects
 * Enhances gallery interactions with hover effects and transitions
 */
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeModal = document.querySelector('.close-modal');
    const prevButton = document.querySelector('.modal-nav.prev');
    const nextButton = document.querySelector('.modal-nav.next');
    
    let currentIndex = 0;
    let filteredItems = [...galleryItems];
    
    // Helper function to preload images for smoother transitions
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // Set up hover effects for gallery items
    galleryItems.forEach((item, index) => {
        const viewButton = item.querySelector('.view-image');
        
        // Add subtle hover tilt effect
        item.addEventListener('mousemove', function(e) {
            const bounds = this.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            
            // Calculate percentage positions
            const xPercent = mouseX / bounds.width - 0.5;
            const yPercent = mouseY / bounds.height - 0.5;
            
            // Apply subtle tilt effect (max 3 degrees)
            const image = this.querySelector('.gallery-image');
            image.style.transform = `perspective(1000px) rotateX(${yPercent * -3}deg) rotateY(${xPercent * 3}deg) scale(1.05)`;
        });
        
        // Reset on mouse leave
        item.addEventListener('mouseleave', function() {
            const image = this.querySelector('.gallery-image');
            image.style.transform = '';
        });
        
        // Set up modal display
        if (viewButton) {
            viewButton.addEventListener('click', function() {
                openModal(index);
            });
        }
    });
    
    // Filter functionality enhancement
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filteredItems = [...galleryItems].filter(item => {
                if (category === 'all') {
                    item.style.display = 'block';
                    return true;
                } else if (item.dataset.category === category) {
                    item.style.display = 'block';
                    return true;
                } else {
                    item.style.display = 'none';
                    return false;
                }
            });
            
            // Add staggered animation to visible items
            filteredItems.forEach((item, i) => {
                item.style.animationDelay = `${i * 0.1}s`;
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = 'galleryItemFade 0.6s ease-out forwards';
            });
        });
    });
    
    // Modal functionality
    function openModal(index) {
        // Ensure we're using the currently filtered items
        if (!filteredItems.includes(galleryItems[index])) {
            return;
        }
        
        currentIndex = filteredItems.indexOf(galleryItems[index]);
        updateModal(currentIndex);
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    function updateModal(index) {
        const item = filteredItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('h3');
        const desc = item.querySelector('p');
        
        // Add transition class for fade effect
        modalImage.classList.add('transitioning');
        
        // Preload the image for smoother transition
        preloadImage(img.src).then(() => {
            setTimeout(() => {
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                
                if (modalTitle && title) {
                    modalTitle.textContent = title.textContent;
                }
                
                if (modalDescription && desc) {
                    modalDescription.textContent = desc.textContent;
                }
                
                modalImage.classList.remove('transitioning');
            }, 300);
        });
    }
    
    function closeModalHandler() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % filteredItems.length;
        updateModal(currentIndex);
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        updateModal(currentIndex);
    }
    
    // Set up modal event listeners
    if (modal) {
        closeModal.addEventListener('click', closeModalHandler);
        
        // Close modal on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModalHandler();
            }
        });
        
        // Next/Previous buttons
        if (prevButton) prevButton.addEventListener('click', prevImage);
        if (nextButton) nextButton.addEventListener('click', nextImage);
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                if (e.key === 'Escape') closeModalHandler();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            }
        });
    }
});