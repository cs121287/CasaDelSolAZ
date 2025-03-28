/**
 * Enhanced script loader with error handling
 * For Casa Del Sol AZ website
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
  
  // First load ScrollTrigger (core plugin), then our own animations
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')
    .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js'))
    .then(() => {
      // Load our site-specific scripts in parallel
      return Promise.all([
        loadScript('js/animations.js'),
        loadScript('js/modal.js')
      ]);
    })
    .catch(err => {
      // Even if something fails, make sure UI is usable
      console.warn('Some animations may not be available:', err);
      
      // Hide loading screen in case of errors
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen && loadingScreen.style.display !== 'none') {
        loadingScreen.style.display = 'none';
      }
    });
}