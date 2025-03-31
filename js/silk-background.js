/**
 * Silk Background Effect
 * Last Modified: 2025-03-31
 */

(function() {
  'use strict';
  
  let ticking = false;
  let animationFrame = null;
  
  function initSilkBackground() {
    const silkBackground = document.querySelector('.silk-background');
    
    if (!silkBackground) return;
    
    // Mouse movement effect
    function handleMouseMove(e) {
      if (window.innerWidth <= 768) return; // Skip on mobile for performance
      
      if (!ticking) {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        
        animationFrame = requestAnimationFrame(() => {
          const mouseX = e.clientX / window.innerWidth;
          const mouseY = e.clientY / window.innerHeight;
          
          // Subtle transform based on mouse position
          const moveX = (mouseX - 0.5) * 5;
          const moveY = (mouseY - 0.5) * 5;
          const rotateZ = (mouseX - 0.5) * 2;
          
          silkBackground.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateZ(${rotateZ}deg)`;
          
          ticking = false;
        });
        
        ticking = true;
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Adjust speed factor based on device capability
    function adjustPerformance() {
      // Check if device is lower-powered
      const isLowPerfDevice = window.navigator.hardwareConcurrency <= 4 || 
                             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isLowPerfDevice) {
        document.documentElement.style.setProperty('--speed-factor', '12'); // Slower animation
        document.documentElement.style.setProperty('--saturate', '6'); // Lower saturation
      }
    }
    
    adjustPerformance();
  }
  
  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSilkBackground);
  } else {
    initSilkBackground();
  }
})();