//import
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const router = useRouter();

// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from 'firebase/app';

// Add the Firebase products that you want to use
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_KEY,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const storage = getStorage();
export const db = getFirestore();
const gProvider = new GoogleAuthProvider();

// enable offline data
// db.enablePersistence()
//   .catch(function(err:any) {
//     if (err.code == 'failed-precondition') {
//       // probably multible tabs open at once
//       console.log('persistance failed');
//     } else if (err.code == 'unimplemented') {
//       // lack of browser support for the feature
//       console.log('persistance not available');
//     }
//   });

onAuthStateChanged(auth, async (user) => {
  const userStore = useUserStore();
  userStore.setUser(user);
});

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};
