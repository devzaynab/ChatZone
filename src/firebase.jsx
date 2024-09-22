// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore'; // Add Firestore functions

const firebaseConfig = {
  apiKey: "AIzaSyB0MQro7Yv8ekRZghOSbfIG03XaTKKpTr4",
  authDomain: "chatzone-81e5b.firebaseapp.com",
  projectId: "chatzone-81e5b",
  storageBucket: "chatzone-81e5b.appspot.com",
  messagingSenderId: "85352328106",
  appId: "1:85352328106:web:84d5cca8713d1d90e2d9d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app); // Ensure Firestore is initialized with the app

export { auth, storage, db };

// Function to update user photo URL
export const updateUserPhotoURL = async (uid, photoURL) => {
  const userDoc = doc(db, "users", uid); // Adjust collection name if necessary
  try {
    await updateDoc(userDoc, { photoURL: photoURL });
    console.log("User photoURL updated successfully");
  } catch (error) {
    console.error("Error updating photoURL:", error);
  }
};
