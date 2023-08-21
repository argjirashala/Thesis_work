import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAdSI0BaFYvdJzsbUyFb68au6JHpr-B1bk", //per Argjiren
    // apiKey: "AIzaSyCIYWjHwiuKan6INr1Ghg1P0E0hJcEUzGA", //per Gojartin
    authDomain: "thesis-c4776.firebaseapp.com", // Per Argjiren replace 'your-domain' with your actual domain
    // authDomain: "healthcare-b0030.firebaseapp.com", //per Gojartin
    projectId: "thesis-c4776", //per Argjiren
    // projectId: "healthcare-b0030", //per Gojartin
    storageBucket: "thesis-c4776.appspot.com", // replace 'your-bucket' with your actual bucket name
    messagingSenderId: "634132668222", // per Argjiren replace 'your-sender-id' with your actual sender id
    // messagingSenderId: "608209282804",//per Gojartin
    // appId: "1:608209282804:web:xxxxxxxxxxxxxx"//per Gojartin
    appId: "1:634132668222:web:xxxxxxxxxxxxxx" // per Argjiren replace 'your-app-id' with your actual app id
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
