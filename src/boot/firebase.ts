// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from 'firebase/app';

// Add the Firebase products that you want to use
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

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


