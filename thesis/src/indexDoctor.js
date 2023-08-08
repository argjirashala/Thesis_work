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
  const [currentDiagnosisAppointment, setCurrentDiagnosisAppointment] = useState(null);
  const [diagnosisText, setDiagnosisText] = useState('');

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
      const appointments = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); // Include the doc.id

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

  const handleDiagnosisChange = (e) => {
    setDiagnosisText(e.target.value);
  };

  const handleSaveDiagnosis = async (appointmentId) => {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await setDoc(appointmentRef, { diagnosis: diagnosisText }, { merge: true });
    // Reset states after saving
    setCurrentDiagnosisAppointment(null);
    setDiagnosisText('');
    alert("Diagnosis saved successfully!");
  };

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
        {bookedAppointments.map((appointment) => (
          <div key={appointment.id}> {/* Use appointment.id as key */}
            <p>Patient: {appointment.patientName}  {appointment.patientSurname}</p>
            <p>Reason: {appointment.reason}</p>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.time}</p>
            <button onClick={() => setCurrentDiagnosisAppointment(appointment.id)}>Add Diagnosis</button>

            {currentDiagnosisAppointment === appointment.id && (
              <div>
                <textarea value={diagnosisText} onChange={handleDiagnosisChange}></textarea>
                <button onClick={() => handleSaveDiagnosis(appointment.id)}>Save Diagnosis</button>
              </div>
            )}
          </div>
))}

      </div>
    </div>
  );
}

export default DoctorPage;
