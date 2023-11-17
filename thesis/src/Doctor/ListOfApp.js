import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import '../Patient/Modal.css';
import './Doctor.css';
import LogoutButton from "../Logout/LogoutButton";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import PatientDetailsTable from './PatientsDetails';
import { NavLink } from "react-router-dom";

function ListOfApp(){
  const { userId } = useParams();
  const db = getFirestore();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  

  const handleChangePassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, doctorDetails.email)
      .then(() => {
        alert('Password reset link sent to your email.');
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        alert('Error sending password reset email. Please try again.');
      });
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const docRef = doc(db, "doctors", userId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setDoctorDetails(docSnapshot.data());
      } else {
        console.error("No such document!");
      }
    };

    fetchDoctorDetails();
  }, [userId]);


  return(
    <><nav>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '1rem',  flexWrap: 'wrap' }}>
      <NavLink to={`/indexDoctor/${userId}`} style={({ isActive }) => ({  
                              backgroundColor: isActive ? ' #005cbf' : '' })}>Home</NavLink>
      <NavLink to={`/setavailability/${userId}`} style={({ isActive }) => ({  
                              backgroundColor: isActive ? ' #005cbf' : '' })}>Set Your Availability</NavLink>
      {/* <NavLink to={`/todaysappointments/${userId}`} activeClassName="active-link">Today's Appointments</NavLink> */}
      <NavLink to={`/upcomingappointments/${userId}`} style={({ isActive }) => ({  
                              backgroundColor: isActive ? ' #005cbf' : '' })}>Upcoming Appointments</NavLink>
      <NavLink to={`/appointmentsTable/${userId}`} style={({ isActive }) => ({  
                              backgroundColor: isActive ? ' #005cbf' : '' })}>List Of Appointments</NavLink>
      <NavLink to={`/register`} style={({ isActive }) => ({  
                              backgroundColor: isActive ? ' #005cbf' : '' })}>Register Patient</NavLink>
                              <button onClick={() => setDetailsVisible(!detailsVisible)}>
           {detailsVisible ? "Hide Details" : "Show Details"}
         </button>
      <LogoutButton style={{ marginLeft: '5rem' }} />
    </div>
  </nav>
  {detailsVisible && (
         <div className="appointment-card">
           <div className={`details-section ${detailsVisible ? "show" : ""}`}>
             <h2>Your Details</h2>
             <p>Name: {doctorDetails.name}</p>
             <p>Surname: {doctorDetails.surname}</p>
             <p>Email: {doctorDetails.email}</p>
             <button onClick={handleChangePassword}>Change Password</button>
           </div>
         </div>

       )}
  <div>
              <PatientDetailsTable />

          </div></>
  );
}

export default ListOfApp;