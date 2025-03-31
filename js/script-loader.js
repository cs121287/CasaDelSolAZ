/**
 * Enhanced script loader with error handling
 * For Casa Del Sol AZ website
 * Version: 1.2 - Last Modified: 2025-03-31 04:06:34
 */
function loadGsapPlugins() {
  // Load script with proper error handling
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = (e) => {
        console.warn(`Script failed to load: ${src}`);
        // Resolve instead of reject to continue chain
        resolve();
      };
      document.body.appendChild(script);
    });
  }
  
  // First check if GSAP is already loaded
  if (typeof gsap === 'undefined') {
    console.error('GSAP not found - loading it first');
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js')
      .then(() => loadPlugins())
      .catch(handleError);
  } else {
    loadPlugins();
  }
  
  function loadPlugins() {
    // First load ScrollTrigger (core plugin), then our own animations
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')
      .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js'))
      .then(() => {
        // Initialize GSAP plugins
        if (typeof gsap !== 'undefined') {
          if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
          }
          if (typeof ScrollToPlugin !== 'undefined') {
            gsap.registerPlugin(ScrollToPlugin);
          }
        }
        
        // Load our site-specific scripts - ensure animations.js loads first
        return loadScript('js/animations.js').then(() => {
          // Only load modal.js after animations are loaded
          return loadScript('js/modal.js');
        });
      })
      .catch(handleError);
  }
  
  function handleError(err) {
    // Even if something fails, make sure UI is usable
    console.warn('Some animations may not be available:', err);
    
    // Make sure all reveal elements are visible even if animations fail
    document.querySelectorAll('.reveal-element').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });
    
    // Hide loading screen in case of errors
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
      loadingScreen.style.display = 'none';
    }
  }
}

// Run immediately
loadGsapPlugins();