/**
 * Video background initialization with edge fade effect
 * Performance optimized for HTTP/2 and resource efficiency
 */
(function() {
  'use strict';
  
  // Execute when DOM is ready
  document.addEventListener('DOMContentLoaded', initVideo);
  
  function initVideo() {
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) return;
    
    // Create video element with optimal attributes
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = false; // We'll start it manually when ready
    video.className = 'background-video';
    
    // Create source element
    const source = document.createElement('source');
    source.src = 'vid/background.mp4';
    source.type = 'video/mp4';
    
    // Connect elements
    video.appendChild(source);
    videoContainer.appendChild(video);
    
    // Add overlay for better text contrast
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';
    videoContainer.appendChild(overlay);
    
    // Add edge fadeout effect (for browsers that don't support mask-image)
    if (!CSS.supports('mask-image', 'radial-gradient(black, transparent)') && 
        !CSS.supports('-webkit-mask-image', 'radial-gradient(black, transparent)')) {
      const fadeEdges = document.createElement('div');
      fadeEdges.className = 'video-edge-fade';
      videoContainer.appendChild(fadeEdges);
    }
    
    // Handle video loading
    video.addEventListener('canplay', function() {
      // Start video when it's ready to play
      video.play().catch(error => {
        console.warn('Video autoplay prevented:', error);
        videoContainer.classList.add('video-fallback');
      });
    });
    
    // Fallback for video loading errors
    video.addEventListener('error', function() {
      videoContainer.classList.add('video-fallback');
      console.warn('Video loading failed, using fallback image');
    });
    
    // Load video appropriately
    if ('connection' in navigator && navigator.connection.saveData) {
      // If data-saver mode is on, use fallback image instead
      videoContainer.classList.add('video-fallback');
    } else {
      // Set to load metadata first for better performance
      video.preload = 'metadata';
      
      // If connection is fast enough, set to auto after a short delay
      setTimeout(() => {
        if (!navigator.connection || 
            !['slow-2g', '2g'].includes(navigator.connection.effectiveType)) {
          video.preload = 'auto';
        }
      }, 300);
    }
  }
})();