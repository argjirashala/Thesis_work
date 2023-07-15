import React, { useEffect } from 'react';
import { collection, addDoc, getFirestore } from "firebase/firestore"; 
import { db } from './firebase';  // import Firestore database

function FirebaseTest() {
  useEffect(() => {
    const addData = async () => {
      try {
        await addDoc(collection(db, "test"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    addData();
  }, []);

  return (
    <div>
      <h1>Testing Firebase</h1>
    </div>
  );
}

export default FirebaseTest;
