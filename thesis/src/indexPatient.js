import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

function PatientPage() {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const db = getFirestore();

  useEffect(() => {
    const fetchDoctors = async () => {
      if (specialization !== "") {
        const q = query(collection(db, "doctors"), where("specialization", "==", specialization));
        const querySnapshot = await getDocs(q);

        const fetchedDoctors = querySnapshot.docs.map(doc => doc.data());
        setDoctors(fetchedDoctors);
      }
    };
    
    fetchDoctors();
  }, [specialization]);
  
  const handleSelect = (e) => {
    setSpecialization(e.target.value);
  }
  
  return (
    <div>
      <select onChange={handleSelect}>
        <option value="">--Select Specialization--</option>
        <option value="Pediatrician">Pediatrician</option>
        {/* Add more specializations as needed */}
      </select>

      {doctors.map(doctor => (
        <div key={doctor.personalID}>
          <p>{doctor.name} {doctor.surname}</p>
          <p>{doctor.email}</p>
          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
}

export default PatientPage;
