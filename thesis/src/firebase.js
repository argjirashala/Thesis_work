import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdSI0BaFYvdJzsbUyFb68au6JHpr-B1bk",
  authDomain: "thesis-c4776.firebaseapp.com",
  projectId: "thesis-c4776",
  storageBucket: "thesis-c4776.appspot.com",
  messagingSenderId: "634132668222",
  appId: "1:634132668222:web:xxxxxxxxxxxxxx",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
