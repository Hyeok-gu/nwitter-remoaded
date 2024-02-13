import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAJICzv2X8cemW_tii0s_TZWissSvp4YiE",
  authDomain: "nwitter-reloaded-d3e7d.firebaseapp.com",
  projectId: "nwitter-reloaded-d3e7d",
  storageBucket: "nwitter-reloaded-d3e7d.appspot.com",
  messagingSenderId: "767279857014",
  appId: "1:767279857014:web:94f2fc4279e65cdedb8e57",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
