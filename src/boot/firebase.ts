//import
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const router = useRouter();

// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from 'firebase/app';

// Add the Firebase products that you want to use
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBWd6tP_aigEC23fLeCMuIazGVyB8Xw4IE',
  authDomain: 'chat-app-596a7.firebaseapp.com',
  projectId: 'chat-app-596a7',
  storageBucket: 'chat-app-596a7.appspot.com',
  messagingSenderId: '573414508296',
  appId: '1:573414508296:web:7471b0632b0de7a9a34ebd',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const storage = getStorage();
export const db = getFirestore();

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
