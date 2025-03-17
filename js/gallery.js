/**
 * Casa Del Sol AZ - Gallery JavaScript
 * Version: 1.0.0
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
    let filteredItems = [];
    
    /**
     * Initialize gallery functions
     */
    function initGallery() {
        setupEvents();
        filteredItems = Array.from(galleryItems);
    }
    
    /**
     * Setup all gallery event listeners
     */
    function setupEvents() {
        // Filter buttons click event
        filterBtns.forEach(btn => {
            btn.addEventListener('click', filterGallery);
        });
        
        // View image buttons click event
        viewBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                openModal(index);
            });
        });
        
        // Close modal events
        if (closeModal) {
            closeModal.addEventListener('click', closeImageModal);
            window.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeImageModal();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
        
        // Modal navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);
    }
    
    /**
     * Filter gallery based on category
     */
    function filterGallery() {
        // Update active button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || category === itemCategory) {
                item.style.display = 'block';
                // Add a small delay for animation effect
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                // After fade out, hide the element
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Update filtered items array
        filteredItems = Array.from(galleryItems).filter(item => {
            const itemCategory = item.getAttribute('data-category');
            return category === 'all' || category === itemCategory;
        });
    }
    
    /**
     * Open modal with image
     * @param {number} index - Index of image in gallery
     */
    function openModal(index) {
        if (!modal || !modalImage) return;
        
        const item = filteredItems[index];
        const img = item.querySelector('img');
        const info = item.querySelector('.gallery-info');
        
        // Set current index
        currentIndex = index;
        
        // Set image source
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        
        // Set caption
        if (info && modalTitle && modalDesc) {
            modalTitle.textContent = info.querySelector('h3').textContent;
            modalDesc.textContent = info.querySelector('p').textContent;
        }
        
        // Show modal
        modal.style.display = 'block';
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        setTimeout(() => {
            modal.classList.add('show');
        }, 50);
    }
    
    /**
     * Close image modal
     */
    function closeImageModal() {
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Re-enable body scroll
            document.body.style.overflow = '';
        }, 300);
    }
    
    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleKeyboard(e) {
        if (!modal || modal.style.display !== 'block') return;
        
        if (e.key === 'Escape') {
            closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    }
    
    /**
     * Show previous image in modal
     */
    function prevImage() {
        if (filteredItems.length <= 1) return;
        
        currentIndex--;
        if (currentIndex < 0) currentIndex = filteredItems.length - 1;
        updateModalImage();
    }
    
    /**
     * Show next image in modal
     */
    function nextImage() {
        if (filteredItems.length <= 1) return;
        
        currentIndex++;
        if (currentIndex >= filteredItems.length) currentIndex = 0;
        updateModalImage();
    }
    
    /**
     * Update modal image and info
     */
    function updateModalImage() {
        const item = filteredItems[currentIndex];
        const img = item.querySelector('img');
        const info = item.querySelector('.gallery-info');
        
        // Add fade effect
        modalImage.style.opacity = '0';
        
        setTimeout(() => {
            // Update image source
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            
            // Update caption
            if (info && modalTitle && modalDesc) {
                modalTitle.textContent = info.querySelector('h3').textContent;
                modalDesc.textContent = info.querySelector('p').textContent;
            }
            
            // Fade in
            modalImage.style.opacity = '1';
        }, 200);
    }
    
    // Initialize gallery
    if (galleryItems.length > 0) {
        initGallery();
    }
});