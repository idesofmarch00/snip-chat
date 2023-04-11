import { register } from 'register-service-worker';

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  registrationOptions: { scope: './' },

  ready(/* registration */) {
    console.log('a.Service worker is active.');
  },

  registered(/* registration */) {
    console.log('b.Service worker has been registered.');
  },

  cached(/* registration */) {
    console.log('c.Content has been cached for offline use.');
  },

  updatefound(/* registration */) {
    // console.log('New content is downloading.')
  },

  updated(/* registration */) {
    console.log('d.New content is available; please refresh.');
  },

  offline() {
    console.log(
      'e.No internet connection found. App is running in offline mode.'
    );
  },

  error(err) {
    console.error('f.Error during service worker registration:', {
      cause: err,
    });
  },
});
