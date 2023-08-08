import React, { useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, doc,addDoc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

function PatientPage() {
  const { userId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointment, setAppointment] = useState({
    reason: "",
    date: "",
    time: ""
  });
  const db = getFirestore();

  const [availableDates, setAvailableDates] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [appointmentToShow, setAppointmentToShow] = useState(null);



  useEffect(() => {
    const fetchDoctors = async () => {
      if (specialization !== "") {
        const q = query(collection(db, "doctors"), where("specialization", "==", specialization));
        const querySnapshot = await getDocs(q);
        const fetchedDoctors = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctors(fetchedDoctors);
      }
    };
    
    fetchDoctors();
  }, [specialization]);


  useEffect(() => {
    if (selectedDoctor) {
      setAvailableDates(Object.keys(selectedDoctor.availability || {}));
    }
}, [selectedDoctor]);

useEffect(() => {
  if (selectedDoctor && selectedDate) {
    const slots = selectedDoctor.availability[selectedDate] || "";
    setAvailableSlots(slots.split(","));
  }
}, [selectedDoctor, selectedDate]);

useEffect(() => {
  const fetchBookedAppointments = async () => {
    const q = query(collection(db, "appointments"), where("patientId", "==", userId)); // Replace with actual patient's ID
    const querySnapshot = await getDocs(q);
    const fetchedAppointments = querySnapshot.docs.map(doc => doc.data());
  
    for (let appointment of fetchedAppointments) {
      const docRef = doc(db, "doctors", appointment.doctorId);
      const doctorSnapshot = await getDoc(docRef);

      if (doctorSnapshot.exists()) {
        appointment.doctorName = doctorSnapshot.data().name;
        appointment.doctorSurname = doctorSnapshot.data().surname;
      }
    }
    setBookedAppointments(fetchedAppointments);
  };
  
  fetchBookedAppointments();
}, []);

useEffect(() => {
  const fetchDiagnosisForAppointments = async () => {
    const updatedAppointments = [...bookedAppointments];

    for (let appointment of updatedAppointments) {
      const docRef = doc(db, "diagnosis", `${appointment.patientId}-${appointment.doctorId}-${appointment.date}`);
      const diagnosisDoc = await getDoc(docRef);

      if (diagnosisDoc.exists()) {
        appointment.diagnosis = diagnosisDoc.data().text;
      }
    }

    setBookedAppointments(updatedAppointments);
  };

  if (bookedAppointments.length > 0) {
    fetchDiagnosisForAppointments();
  }
}, [bookedAppointments]);



  
  const handleSelect = (e) => {
    setSpecialization(e.target.value);
  }

  const handleBooking = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleClose = () => {
    setSelectedDoctor(null);
    setAppointment({ reason: "", date: "", time: "" });
  };

  const handleSlotSelection = (slot) => {
    setAppointment({ ...appointment, time: slot });
  };

  const handleInputChange = (e) => {
      if (e.target.name === "date") {
        setSelectedDate(e.target.value);
      }
      setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };
  
  
  const handleBookAppointment = async () => {
    console.log("Appointment booked:", appointment, selectedDoctor);
    
    const dateKey = new Date(selectedDate).toISOString().split("T")[0];

    const updatedSlots = availableSlots.filter(slot => slot !== appointment.time).join(",");
    
    // Update the doctor's availability in Firestore
    const docRef = doc(db, "doctors", selectedDoctor.id);
    const doctor = await getDoc(docRef);
    const currentAvailability = doctor.data().availability || {};
    currentAvailability[dateKey] = updatedSlots;
    await updateDoc(docRef, { availability: currentAvailability });
  
    // Add the new appointment to the 'appointments' collection in Firestore
    const appointmentRef = collection(db, 'appointments');
    await addDoc(appointmentRef, {
      patientId: userId,  // Replace with actual patient's ID
      doctorId: selectedDoctor.id,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
    });
  
    handleClose();
  };
  

  return (
    <div>
      <select onChange={handleSelect}>
        <option value="">--Select Specialization--</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="AerospaceMedicineSpecialist">Aerospace Medicine Specialist</option>
    <option value="Allergist">Allergist</option>
    <option value="Anaesthesiologist">Anaesthesiologist</option>
    <option value="Andrologist">Andrologist</option>
    <option value="Cardiologist">Cardiologist</option>
    <option value="Cardiac Electrophysiologist">Cardiac Electrophysiologist</option>
    <optgroup label="DentalCare">
    <option value="GeneralDentist">General Dentist</option>
    <option value="Pedodontist">Pedodontist</option>
    <option value="Orthodontist">Orthodontist</option>
    <option value="Periodontist">Periodontist</option>
    <option value="Endodontist">Endodontist</option>
    <option value="OralSurgeon">Oral Surgeon</option>
    <option value="Prosthodontist">Prosthodontist</option>
  </optgroup>
    <option value="Dermatologist">Dermatologist</option>
    <option value="Dietitian/Dietician">Dietitian/Dietician</option>
    <option value="EmergencyRoomDoctor">Emergency Room (ER) Doctor</option>
    <option value="Endocrinologist">Endocrinologist</option>
    <option value="Epidemiologist">Epidemiologist</option>
    <option value="Family Medicine Physician">Family Medicine Physician</option>
    <option value="Gastroenterologist">Gastroenterologist</option>
    <option value="Geriatrician">Geriatrician</option>
    <option value="Hyperbarichysician">Hyperbaric Physician</option>
    <option value="Hematologist">Hematologist</option>
    <option value="Hepatologist">Hepatologist</option>
    <option value="Immunologist">Immunologist</option>
    <option value="InfectiousDiseaseSpecialist">Infectious Disease Specialist</option>
    <option value="Intensivist">Intensivist</option>
    <option value="Neonatologist">Neonatologist</option>
    <option value="Nephrologist">Nephrologist</option>
    <option value="Neurologist">Neurologist</option>
    <option value="Neurosurgeon">Neurosurgeon</option>
    <option value="Obstetrician/Gynecologist">Obstetrician/Gynecologist</option>
    <option value="Oncologist">Oncologist</option>
    <option value="Ophthalmologist">Ophthalmologist</option>
    <option value="Orthopedist">Orthopedist</option>
    <option value="Parasitologist">Parasitologist</option>
    <option value="Pathologist">Pathologist</option>
    <option value="Pediatrician">Pediatrician</option>
    <option value="Physiatrist">Physiatrist</option>
    <option value="PlasticSurgeon">Plastic Surgeon</option>
    <option value="Psychiatrist">Psychiatrist</option>
    <option value="Pulmonologist">Pulmonologist</option>
    <option value="Radiologist">Radiologist</option>
    <option value="Urologist">Urologist</option>
    <option value="VascularSurgeon">Vascular Surgeon</option>
    <option value="Veterinarian">Veterinarian</option>
      </select>

      {doctors.map(doctor => (
        <div key={doctor.personalID}>
          <p>{doctor.name} {doctor.surname}</p>
          <p>{doctor.email}</p>
          <p>{doctor.clinic}</p>
          <button onClick={() => handleBooking(doctor)}>Book Appointment</button>
          {/* Add more fields as needed */}
        </div>
      ))}
      {selectedDoctor && (
    <div className="modal">
      <h2>Book Appointment with {selectedDoctor.name} {selectedDoctor.surname}</h2>
      <label>
        Reason:
        <textarea name="reason" onChange={handleInputChange} required />
      </label>
      <label>
        Date:
        <select name="date" onChange={handleInputChange}>
            <option>--Select Date--</option>
            {availableDates.map(date => (
                <option key={date} value={date}>{date}</option>
            ))}
        </select>
      </label>
      {availableSlots.map(slot => (
        <button key={slot} onClick={() => handleSlotSelection(slot)}>{slot}</button>
      ))}
      <button onClick={handleBookAppointment}>Confirm</button>
      <button onClick={handleClose}>Cancel</button>
    </div>
)}

<div className="booked-appointments">
  <h2>Your Booked Appointments</h2>
  {bookedAppointments.map(appointment => (
  <div key={`${appointment.date}-${appointment.time}`}>
    <p>Doctor: {appointment.doctorName} {appointment.doctorSurname}</p>
    <p>Date: {appointment.date}</p>
    <p>Time: {appointment.time}</p>
    <p>Reason: {appointment.reason}</p>
    {appointment.diagnosis && (
      <>
        <button onClick={() => setAppointmentToShow(appointment)}>Show Diagnosis</button>
        {appointmentToShow === appointment && <p>Diagnosis: {appointment.diagnosis}</p>}
      </>
    )}
  </div>
))}
</div>


    </div>
  );
}

export default PatientPage;
