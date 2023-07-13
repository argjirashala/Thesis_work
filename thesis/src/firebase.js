import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAdSI0BaFYvdJzsbUyFb68au6JHpr-B1bk",
    authDomain: "thesis-c4776.firebaseapp.com", // replace 'your-domain' with your actual domain
    projectId: "thesis-c4776",
    storageBucket: "thesis-c4776.appspot.com", // replace 'your-bucket' with your actual bucket name
    messagingSenderId: "634132668222", // replace 'your-sender-id' with your actual sender id
    appId: "1:634132668222:web:xxxxxxxxxxxxxx" // replace 'your-app-id' with your actual app id
};
      
  

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
