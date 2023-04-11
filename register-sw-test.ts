  // Don't register the service worker
  // until the page has fully loaded
  self.addEventListener('load', () => {
    // Is service worker available?
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw-test.ts').then(() => {
        console.log('Service worker registered!');
      }).catch((error:Error) => {
        console.warn('Error registering service worker:');
        console.warn(error);
      });
    }
  });
