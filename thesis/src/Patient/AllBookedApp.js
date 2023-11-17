import React, { useState, useEffect} from 'react';
import { useParams,NavLink } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, doc,addDoc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import './Patient.css';
import Modal from './Modal';
import LogoutButton from '../Logout/LogoutButton'
import { sendPasswordResetEmail, getAuth } from "firebase/auth";


function AllBookedApp() { 
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
  const [patientDetails, setPatientDetails] = useState({});
  const [detailsVisible, setDetailsVisible] = useState(false);

  

const handleChangePassword = () => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, patientDetails.email)
    .then(() => {
      alert('Password reset link sent to your email.');
    })
    .catch((error) => {
      console.error('Error sending password reset email:', error);
      alert('Error sending password reset email. Please try again.');
    });
};


useEffect(() => {
  const fetchPatientDetails = async () => {
    const docRef = doc(db, "patients", userId);
    const patientDoc = await getDoc(docRef);
    if (patientDoc.exists()) {
      setPatientDetails(patientDoc.data());
    }
    else {
      console.error('Patient document does not exist');
    }
  };
  
  fetchPatientDetails();
}, [userId]);

  



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
    const slots = selectedDoctor.availability[selectedDate] || [];
    if (Array.isArray(slots)) {
      setAvailableSlots(slots);
    } else {
      console.error("slots is not an array", slots);
    }
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
    
    const docRef = doc(db, "doctors", selectedDoctor.id);
    const doctor = await getDoc(docRef);
    const currentAvailability = doctor.data().availability || {};
    currentAvailability[dateKey] = updatedSlots;
    await updateDoc(docRef, { availability: currentAvailability });
  
    const appointmentRef = collection(db, 'appointments');
    await addDoc(appointmentRef, {
      patientId: userId, 
      doctorId: selectedDoctor.id,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
    });
  
    handleClose();
  };

  return(
    <><nav>
    <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', // Apply space-between here
          width: '100%', 
          paddingRight: '1rem',  
          flexWrap: 'wrap' 
        }}>
      <div style={{ display: 'flex', alignItems: 'center' }}> {/* Wrap NavLinks in a flex container */}
        <NavLink to={`/indexPatient/${userId}`} style={({ isActive }) => ({  
                                  backgroundColor: isActive ? ' #005cbf' : '' })}>Home</NavLink>
        {/* <NavLink to={`/todaysappointments/${userId}`} activeClassName="active-link">Today's Appointments</NavLink> */}
        <NavLink to={`/bookedappointments/${userId}`} style={({ isActive }) => ({  
                                  backgroundColor: isActive ? ' #005cbf' : '' })}>Booked appointments</NavLink>
          </div>
    <div>
    <button onClick={() => setDetailsVisible(!detailsVisible)}>
  {detailsVisible ? "Hide Details" : "Show Details"}
</button>
&nbsp;&nbsp;
    <LogoutButton style={{ marginLeft: 'auto' }} /> {/* This will be pushed to the right corner */}
  </div>
  </div>
</nav>
{detailsVisible && (
  <div className="appointment-card">
    <div className={`details-section ${detailsVisible ? "show" : ""}`}>
    <h2>Your Details</h2>
    <p>Name: {patientDetails.name}</p>
    <p>Surname: {patientDetails.surname}</p>
    <p>Email: {patientDetails.email}</p>
    <button onClick={handleChangePassword}>Change Password</button>
  </div>
  </div>
  
)}

  <div className="booked-appointments">
              <h2>Your Booked Appointments</h2>
              <div className="appointments-row">
                  {bookedAppointments.map(appointment => (
                      <div key={`${appointment.date}-${appointment.time}`} className="appointment-card">
                          <p>Doctor: {appointment.doctorName} {appointment.doctorSurname}</p>
                          <p>Date: {appointment.date}</p>
                          <p>Time: {appointment.time}</p>
                          <p>Reason: {appointment.reason}</p>
                          {appointment.diagnosis && (
                              <>
                                  <button onClick={() => setAppointmentToShow(appointment)}>Show Diagnosis and Therapy</button>
                                  <Modal isOpen={appointmentToShow === appointment} onClose={() => setAppointmentToShow(null)} appointment={appointment} />
                              </>
                          )}
                      </div>
                  ))}
              </div>
          </div></>
  );
  
}

export default AllBookedApp;