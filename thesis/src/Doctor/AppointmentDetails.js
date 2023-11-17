import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const [details, setDetails] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchDetails = async () => {
      const docRef = doc(db, "appointments", appointmentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDetails(docSnap.data());
      } else {
        // Handle the error
        console.log("No such document!");
      }
    };

    fetchDetails();
  }, [appointmentId]);

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Appointment Details</h1>
      <p>Diagnosis: {details.diagnosis}</p>
      <p>Therapy: {details.therapy}</p>
      {details.fileURL && (
            <iframe className="iframe" src={details.fileURL}></iframe>
        )}
    </div>
  );
};

export default AppointmentDetails;
