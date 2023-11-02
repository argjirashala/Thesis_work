import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './Modal.css';
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import PatientDetailsTable from './PatientsDetails';



function DoctorPage() {
  const { userId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [bookedAppointments, setBookedAppointments] = useState([]); // Store booked appointments
  const db = getFirestore();
  const [currentDiagnosisAppointment, setCurrentDiagnosisAppointment] = useState(null);
  const [diagnosisText, setDiagnosisText] = useState('');
  const [therapyText, setTherapyText] = useState('');
  const [currentPatientAppointments, setCurrentPatientAppointments] = useState(null);
  const [currentDetailsAppointment, setCurrentDetailsAppointment] = useState(null);
  const [modifyAppointment, setModifyAppointment] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  let navigate = useNavigate();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState(null);

  const handleAddSlot = () => {
    // reset error state
    setError(null);

    if (startTime >= endTime) {
    console.log("Error condition met!");
    setError("End time should be after start time.");
    return;
}


    const dateKey = selectedDate.toISOString().split("T")[0];
    const newSlot = `${startTime}-${endTime}`;
    setAvailability(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newSlot]
    }));
    setStartTime("");
    setEndTime("");
};

const handleRemoveSlot = (slotToRemove) => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    setAvailability(prev => ({
        ...prev,
        [dateKey]: prev[dateKey].filter(slot => slot !== slotToRemove)
    }));
};

const dateKey = selectedDate.toISOString().split("T")[0];
const selectedTimeSlots = availability[dateKey] || [];

useEffect(() => {
  console.log("Error state changed to:", error);
}, [error]);




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
        setAvailability(docSnapshot.data().availability || {});
      } else {
        console.error("No such document!");
      }
    };

    fetchDoctorDetails();
  }, [userId]);


  const handleSaveAvailability = async () => {
    const docRef = doc(db, "doctors", userId);
    await setDoc(docRef, { availability }, { merge: true });
    alert("Availability saved successfully!");
  };

 

  const handleDiagnosisChange = (e) => {
    setDiagnosisText(e.target.value);
  };

  const handleTherapyChange = (e) => { 
    setTherapyText(e.target.value);
  };

  // const handleSaveDiagnosisAndTherapy = async (appointmentId) => {
  //   const appointmentRef = doc(db, "appointments", appointmentId);
  //   await setDoc(appointmentRef, { diagnosis: diagnosisText, therapy: therapyText }, { merge: true }); // Save both diagnosis and therapy
  //   setCurrentDiagnosisAppointment(null);
  //   setDiagnosisText('');
  //   setTherapyText('');
  //   alert("Diagnosis and therapy saved successfully!");
  // };

  const removeAppointmentFromToday = (appointmentId) => {
    setTodaysAppointments((prevAppointments) => 
      prevAppointments.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  const handleSaveDiagnosisAndTherapy = async (appointmentId) => {
    const appointmentRef = doc(db, "appointments", appointmentId);
    const appointmentSnapshot = await getDoc(appointmentRef);
    if (appointmentSnapshot.exists()) {
      const appointment = appointmentSnapshot.data();
      await setDoc(appointmentRef, {
        diagnosis: diagnosisText,
        therapy: therapyText,
        date: appointment.date
      }, { merge: true });
      setCurrentDiagnosisAppointment(null);
      setDiagnosisText('');
      setTherapyText('');
      removeAppointmentFromToday(appointmentId);
      alert("Diagnosis and therapy saved successfully!");
    }
  };
  
 
  

  const handleFileUpload = async (file, appointmentId) => {
    if (!file) {
      alert("Please select a file to upload first!");
      return;
    }
    const storage = getStorage();
    const storageRef = ref(storage, 'files/' + appointmentId + "/" + file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
        'state_changed',
        (snapshot) => {
        },
        (error) => {
            console.error("File upload error:", error);
        },
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const appointmentRef = doc(db, "appointments", appointmentId);
            await setDoc(appointmentRef, { fileURL: downloadURL }, { merge: true });
            setUploadingFile(null);
        }
    );
};
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    console.log(file);
    setUploadingFile(file);
  } else {
    alert("Failed to select file. Please try again!");
  }
}




const [todaysAppointments, setTodaysAppointments] = useState([]);
const [upcomingAppointments, setUpcomingAppointments] = useState([]);
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

  const todayDate = new Date().toISOString().split("T")[0];

  const todays = appointments.filter(app => app.date === todayDate && app.therapy === '' && app.diagnosis === '');
  const upcoming = appointments.filter(app => new Date(app.date) > new Date());

  setTodaysAppointments(todays);
  setUpcomingAppointments(upcoming);
};

useEffect(() => {
  fetchBookedAppointments();
}, [userId]);







 return (
  <div>
    <h1 style={{color: "white"}}>Welcome, Dr. {doctorDetails?.name}</h1>
    <LogoutButton />
    <br></br>
    <br></br>
    <button onClick={() => navigate('/register')}>Register Patient</button>
    <button onClick={() => setDetailsVisible(!detailsVisible)}>
  {detailsVisible ? "Hide Details" : "Show Details"}
</button>

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
    <div className="booked-appointments">
      
    <div className="availability-section">
    <h3>Set Your Availability</h3>
    
    {/* <DatePicker selected={selectedDate} onChange={handleDateChange} /> */}
    <DatePicker selected={selectedDate} onChange={setSelectedDate} />
            <div>
                <label>Start Time:</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />

                <label>End Time:</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />

                <button onClick={handleAddSlot} disabled={startTime >= endTime}>Add Slot</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h4>Your availability slots:</h4>
            {selectedTimeSlots.map((slot, index) => (
                <div key={index}>
                    {slot} <button onClick={() => handleRemoveSlot(slot)}>Remove</button>
                </div>
            ))}

            
    <button onClick={handleSaveAvailability}>Save Availability</button>
  </div>

    </div>
    
    <div className="booked-appointments">
    <h2>Today's Appointments</h2>
    <div className="appointments-row">
  
  {todaysAppointments.map(appointment => (
    <div key={appointment.id} className="appointment-card">
      Patient's name: {appointment.patientName}
      <br />
      Date: {appointment.date}
      <br />
      Time: {appointment.time}
      <br />
      Reason: {appointment.reason}
      <br />
      <button onClick={() => setCurrentDiagnosisAppointment(appointment.id)}>
        Add Diagnosis and Therapy
      </button>
      {currentDiagnosisAppointment === appointment.id && (
        <div className="modal">
          <br></br>
          <br></br>
          <button className="close-btn" onClick={() => setCurrentDiagnosisAppointment(null)}>&times;</button>
          <textarea value={diagnosisText} onChange={handleDiagnosisChange} placeholder="Enter diagnosis..."></textarea>
          <textarea value={therapyText} onChange={handleTherapyChange} placeholder="Enter therapy..."></textarea>
          <input type="file" onChange={handleFileChange} />
                    <button onClick={() => {
                      handleFileUpload(uploadingFile, appointment.id);
                    } }>Upload File</button>
          <br></br>
          
          <button onClick={() => {
            handleSaveDiagnosisAndTherapy(appointment.id);
            setCurrentDiagnosisAppointment(null);
          }}>Save Diagnosis and Therapy</button>
          
          
        </div>
      )}
    </div>
  ))}
  </div>
</div>

<div className="booked-appointments">
  <h2>Upcoming Appointments</h2>
  {upcomingAppointments.map(appointment => (
    <div key={appointment.id} className="appointment-card">
      Patient's name: {appointment.patientName}
      <br />
      Date: {appointment.date}
      <br />
      Time: {appointment.time}
      <br />
      Reason: {appointment.reason}
      <br />
      {/* Additional code if you need buttons or actions for upcoming appointments */}
    </div>
  ))}
</div>
<div>
<PatientDetailsTable/>

</div>
  </div>
);

}

export default DoctorPage;