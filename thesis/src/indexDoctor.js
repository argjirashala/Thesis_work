import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

const togglePatientAppointments = (patientId) => {
  if (currentPatientAppointments === patientId) {
    setCurrentPatientAppointments(null);  // If already expanded, collapse
  } else {
    setCurrentPatientAppointments(patientId); // Else expand
  }
};



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

  const handleTherapyChange = (e) => {   // Handle therapy change
    setTherapyText(e.target.value);
  };

  const handleSaveDiagnosisAndTherapy = async (appointmentId) => {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await setDoc(appointmentRef, { diagnosis: diagnosisText, therapy: therapyText }, { merge: true }); // Save both diagnosis and therapy
    // Reset states after saving
    setCurrentDiagnosisAppointment(null);
    setDiagnosisText('');
    setTherapyText('');
    alert("Diagnosis and therapy saved successfully!");
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
            // Progress handling can be added here
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
    setUploadingFile(file);
  } else {
    alert("Failed to select file. Please try again!");
  }
}



  // Sorting the booked appointments
const sortedAppointments = bookedAppointments.sort((a, b) => {
  const dateA = new Date(a.date);  // Assuming `date` is the field name in your appointment object
  const dateB = new Date(b.date);

  // Current or future dates first, past dates later
  if (dateA < new Date() && dateB >= new Date()) {
    return 1;
  }
  if (dateA >= new Date() && dateB < new Date()) {
    return -1;
  }
  return dateA - dateB;  // Otherwise, sort by date ascending
});

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
    <div>
      <h2>Your Booked Appointments</h2>
      
      {[...new Set(sortedAppointments.map(app => app.patientId))].map(patientId => {
        const patientAppointments = sortedAppointments.filter(app => app.patientId === patientId);
        const firstAppointment = patientAppointments[0];
        
        return (
          <div key={patientId}>
            <p>Patient: {firstAppointment.patientName} {firstAppointment.patientSurname}</p>
            <button onClick={() => togglePatientAppointments(patientId)}>Appointments</button>

            {currentPatientAppointments === patientId && (
              <div>
                {patientAppointments.map(appointment => (
                  <div key={appointment.id}>
                    {/* Display appointment details */}
                    Patient's name: {appointment.patientName}
                    <br />
                    Patient's surname: {appointment.patientSurname}
                    <br />
                    Date: {appointment.date}
                    <br />
                    Time: {appointment.time}
                    <br />
                    
                    {appointment.diagnosis && appointment.therapy ? (
                      <div>
                        <button onClick={() => setCurrentDetailsAppointment(appointment.id)}>Details</button>
                        <button onClick={() => setModifyAppointment(appointment.id)}>Modify</button>

                        {currentDetailsAppointment === appointment.id && (
                          <div>
                            <p>Diagnosis: {appointment.diagnosis}</p>
                            <p>Therapy: {appointment.therapy}</p>
                          </div>
                        )}

                        {modifyAppointment === appointment.id && (
                          <div>
                            <textarea value={diagnosisText} onChange={handleDiagnosisChange} placeholder="Enter diagnosis..."></textarea>
                            <textarea value={therapyText} onChange={handleTherapyChange} placeholder="Enter therapy..."></textarea>
                            <button onClick={() => {
                              handleSaveDiagnosisAndTherapy(appointment.id);
                              setModifyAppointment(null);
                            }}>Save Changes</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button onClick={() => setCurrentDiagnosisAppointment(appointment.id)}>Add Diagnosis and Therapy</button>
                      
                    )}
                    <input type="file" onChange={handleFileChange} />
<button onClick={() => {
    handleFileUpload(uploadingFile, appointment.id);
}}>Upload File</button>


                    {currentDiagnosisAppointment === appointment.id && (
                      <div>
                        <textarea value={diagnosisText} onChange={handleDiagnosisChange} placeholder="Enter diagnosis..."></textarea>
                        <textarea value={therapyText} onChange={handleTherapyChange} placeholder="Enter therapy..."></textarea>
                        <button onClick={() => {
                          handleSaveDiagnosisAndTherapy(appointment.id);
                          setCurrentDiagnosisAppointment(null);
                        }}>Save Diagnosis and Therapy</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

}

export default DoctorPage;
