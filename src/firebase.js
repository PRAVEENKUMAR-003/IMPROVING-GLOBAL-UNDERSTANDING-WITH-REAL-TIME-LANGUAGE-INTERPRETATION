// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
 

const firebaseConfig = {

  authDomain: "chatapplication-6cf2d.firebaseapp.com",
  projectId: "chatapplication-6cf2d",
  storageBucket: "chatapplication-6cf2d.appspot.com",
  messagingSenderId: "383348145969",
  appId: "1:383348145969:web:67331e91a98c69f021ba10",
  measurementId: "G-NY4WNMGZFX"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();


