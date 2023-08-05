import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

function PatientPage() {
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
    // Implement logic for booking the appointment, such as adding it to an 'appointments' collection
    console.log("Appointment booked:", appointment, selectedDoctor);
    
    // Mark the slot as booked in the doctor's availability
    const dateKey = selectedDate.toISOString().split("T")[0];
    const updatedSlots = availableSlots.filter(slot => slot !== appointment.time).join(",");
    
    // This part needs a little bit of adjustment
    const docRef = doc(db, "doctors", selectedDoctor.id);
    const doctor = await getDoc(docRef);
    const currentAvailability = doctor.data().availability || {};
    currentAvailability[dateKey] = updatedSlots;
    await updateDoc(docRef, { availability: currentAvailability });

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

    </div>
  );
}

export default PatientPage;
