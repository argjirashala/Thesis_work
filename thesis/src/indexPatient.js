import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

function PatientPage() {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointment, setAppointment] = useState({
    reason: "",
    date: "",
    time: ""
  });
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

  const handleBooking = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleClose = () => {
    setSelectedDoctor(null);
    setAppointment({ reason: "", date: "", time: "" });
  };

  const handleInputChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };
  
  const handleBookAppointment = () => {
    // Implement logic for booking the appointment
    console.log("Appointment booked:", appointment, selectedDoctor);
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
            <input type="date" name="date" onChange={handleInputChange} required />
          </label>
          <label>
            Time:
            <input type="time" name="time" onChange={handleInputChange} required />
          </label>
          <button onClick={handleBookAppointment}>Confirm</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default PatientPage;
