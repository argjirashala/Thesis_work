import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

function DoctorPage() {
  const { userId } = useParams(); // Get the UID from the URL
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [availability, setAvailability] = useState({
    days: [],
    times: [],
  });
  const db = getFirestore();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const docRef = doc(db, "doctors", userId);
      console.log("Fetching doctor with UID:", userId); // Add this line
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setDoctorDetails(docSnapshot.data());
        console.log(docSnapshot.data());
        setAvailability(
          docSnapshot.data().availability || { days: [], times: [] }
        );
      } else {
        console.error("No such document!");
      }
    };

    fetchDoctorDetails();
  }, [userId]);

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailability({
      ...availability,
      [name]: value.split(","),
    });
  };

  const handleSaveAvailability = async () => {
    const docRef = doc(db, "doctors", userId);
    await setDoc(docRef, { availability }, { merge: true });
    alert("Availability saved successfully!");
  };

  return (
    <div>
      <h1>Welcome, Dr. {doctorDetails?.name}</h1>
      <h3>Set Your Availability</h3>
      <label>
        Days:
        <input
          type="text"
          name="days"
          placeholder="Mon,Tue,Wed"
          onChange={handleAvailabilityChange}
          value={availability.days.join(",")}
        />
      </label>
      <label>
        Times:
        <input
          type="text"
          name="times"
          placeholder="09:00-12:00,14:00-16:00"
          onChange={handleAvailabilityChange}
          value={availability.times.join(",")}
        />
      </label>
      <button onClick={handleSaveAvailability}>Save Availability</button>
      {/* Render other doctor's details if needed */}
    </div>
  );
}

export default DoctorPage;
