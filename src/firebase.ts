// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChTe1lFohhkQ83o0NW7W8D36VlUrP4eTM",
  authDomain: "dropbox-clone-6cdd3.firebaseapp.com",
  projectId: "dropbox-clone-6cdd3",
  storageBucket: "dropbox-clone-6cdd3.appspot.com",
  messagingSenderId: "404554320983",
  appId: "1:404554320983:web:f4c63340e5d53b36806712",
  measurementId: "G-V29MNBD86Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage }