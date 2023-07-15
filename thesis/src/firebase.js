import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAdSI0BaFYvdJzsbUyFb68au6JHpr-B1bk",
    authDomain: "thesis-c4776.firebaseapp.com", // replace 'your-domain' with your actual domain
    projectId: "thesis-c4776",
    storageBucket: "thesis-c4776.appspot.com", // replace 'your-bucket' with your actual bucket name
    messagingSenderId: "634132668222", // replace 'your-sender-id' with your actual sender id
    appId: "1:634132668222:web:xxxxxxxxxxxxxx" // replace 'your-app-id' with your actual app id
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
