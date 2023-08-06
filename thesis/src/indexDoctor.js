import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

function DoctorPage() {
  const { userId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [bookedAppointments, setBookedAppointments] = useState([]); // Store booked appointments
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

  // useEffect(() => {
  //   const fetchBookedAppointments = async () => {
  //     const q = query(collection(db, "appointments"), where("doctorId", "==", userId));
  //     const querySnapshot = await getDocs(q);
  //     const appointments = querySnapshot.docs.map(doc => doc.data());
  //     setBookedAppointments(appointments);
  //   };

  //   fetchBookedAppointments();
  // }, [userId]);

  useEffect(() => {
    const fetchBookedAppointments = async () => {
      const q = query(collection(db, "appointments"), where("doctorId", "==", userId));
      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs.map(doc => doc.data());

      for (let appointment of appointments) {
        const patientRef = doc(db, "patients", appointment.patientId);
        const patientSnapshot = await getDoc(patientRef);

        if (patientSnapshot.exists()) {
          appointment.patientName = patientSnapshot.data().name;
          appointment.patientSurname = patientSnapshot.data().surname;
        }
      }

      setBookedAppointments(appointments);
    };

    fetchBookedAppointments();
  }, [userId]);


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    const dateKey = selectedDate.toISOString().split("T")[0];
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
      
      {/* Display booked appointments */}
      <div>
        <h2>Your Booked Appointments</h2>
        {bookedAppointments.map((appointment, index) => (
          <div key={index}>
            <p>Patient: {appointment.patientName}  {appointment.patientSurname}</p>
            <p>Reason: {appointment.reason}</p>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.time}</p>
            {/* Add more fields as needed */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorPage;
