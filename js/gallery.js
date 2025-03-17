/**
 * Casa Del Sol AZ - Gallery JavaScript
 * Version: 2.0.0
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Cache DOM elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const viewBtns = document.querySelectorAll('.view-image');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.modal-nav.prev');
    const nextBtn = document.querySelector('.modal-nav.next');
    
    // Variables
    let currentIndex = 0;
    let filteredItems = Array.from(galleryItems);
    
    /**
     * Initialize gallery functions
     */
    function initGallery() {
        setupFilterEvents();
        setupModalEvents();
    }
    
    /**
     * Setup filter button events
     */
    function setupFilterEvents() {
        // Filter buttons click event
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Update filtered items array
                filteredItems = Array.from(galleryItems).filter(item => {
                    return category === 'all' || item.getAttribute('data-category') === category;
                });
            });
        });
    }
    
    /**
     * Setup modal events
     */
    function setupModalEvents() {
        // View buttons
        viewBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const galleryItem = this.closest('.gallery-item');
                const itemIndex = filteredItems.indexOf(galleryItem);
                if (itemIndex !== -1) {
                    openModal(itemIndex);
                }
            });
        });
        
        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', closeImageModal);
            window.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeImageModal();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (modal && modal.style.display === 'block') {
                if (e.key === 'Escape') {
                    closeImageModal();
                } else if (e.key === 'ArrowLeft') {
                    prevImage();
                } else if (e.key === 'ArrowRight') {
                    nextImage();
                }
            }
        });
        
        // Navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);
    }
    
    /**
     * Open modal with image
     * @param {number} index - Index of image in gallery
     */
    function openModal(index) {
        if (!modal || !modalImage) return;
        
        currentIndex = index;
        updateModalContent();
        
        // Show modal
        modal.style.display = 'block';
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Update modal content
     */
    function updateModalContent() {
        const item = filteredItems[currentIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('h3');
        const desc = item.querySelector('p');
        
        // Set image source
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        
        // Set caption
        if (modalTitle && title) modalTitle.textContent = title.textContent;
        if (modalDesc && desc) modalDesc.textContent = desc.textContent;
    }
    
    /**
     * Close image modal
     */
    function closeImageModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    /**
     * Show previous image
     */
    function prevImage() {
        if (filteredItems.length <= 1) return;
        
        currentIndex--;
        if (currentIndex < 0) currentIndex = filteredItems.length - 1;
        updateModalContent();
    }
    
    /**
     * Show next image
     */
    function nextImage() {
        if (filteredItems.length <= 1) return;
        
        currentIndex++;
        if (currentIndex >= filteredItems.length) currentIndex = 0;
        updateModalContent();
    }
    
    // Initialize gallery if items exist
    if (galleryItems.length > 0) {
        initGallery();
    }
});