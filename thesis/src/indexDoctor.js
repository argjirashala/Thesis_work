import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

function DoctorPage() {
  const { userId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState({}); // Store availability as an object with dates as keys
  const db = getFirestore();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const docRef = doc(db, "doctors", userId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setDoctorDetails(docSnapshot.data());
        setAvailability(docSnapshot.data().availability || {});
      } else {
        console.error("No such document!");
      }
    };

    fetchDoctorDetails();
  }, [userId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    const dateKey = selectedDate.toISOString().split("T")[0]; // Convert date to string
    setAvailability({
      ...availability,
      [dateKey]: time,
    });
  };

  const handleSaveAvailability = async () => {
    const docRef = doc(db, "doctors", userId);
    await setDoc(docRef, { availability }, { merge: true });
    alert("Availability saved successfully!");
  };

  const dateKey = selectedDate.toISOString().split("T")[0];
  const selectedTime = availability[dateKey] || "";

  return (
    <div>
      <h1>Welcome, Dr. {doctorDetails?.name}</h1>
      <h3>Set Your Availability</h3>
      <DatePicker selected={selectedDate} onChange={handleDateChange} />
      <label>
        Times:
        <input
          type="text"
          placeholder="09:00-12:00,14:00-16:00"
          onChange={handleTimeChange}
          value={selectedTime}
        />
      </label>
      <button onClick={handleSaveAvailability}>Save Availability</button>
    </div>
  );
}

export default DoctorPage;

