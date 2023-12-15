import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "../Patient/Modal.css";
import "./Doctor.css";
import { NavLink } from "react-router-dom";
import LogoutButton from "../Logout/LogoutButton";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";

function DoctorPage() {
  const { userId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [availability, setAvailability] = useState({});
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const db = getFirestore();
  const [currentDiagnosisAppointment, setCurrentDiagnosisAppointment] =
    useState(null);
  const [diagnosisText, setDiagnosisText] = useState("");
  const [therapyText, setTherapyText] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [uploadingFile, setUploadingFile] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    console.log("Error state changed to:", error);
  }, [error]);

  const handleChangePassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, doctorDetails.email)
      .then(() => {
        alert("Password reset link sent to your email.");
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        alert("Error sending password reset email. Please try again.");
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

  const handleDiagnosisChange = (e) => {
    setDiagnosisText(e.target.value);
  };

  const handleTherapyChange = (e) => {
    setTherapyText(e.target.value);
  };

  const handleInfoChange = (e) => {
    setExtraInfo(e.target.value);
  };

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
      await setDoc(
        appointmentRef,
        {
          diagnosis: diagnosisText,
          therapy: therapyText,
          info: extraInfo,
          date: appointment.date,
        },
        { merge: true }
      );
      setCurrentDiagnosisAppointment(null);
      setDiagnosisText("");
      setTherapyText("");
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
    const storageRef = ref(storage, "files/" + appointmentId + "/" + file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
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
  };

  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const fetchBookedAppointments = async () => {
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

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

    const todays = appointments.filter(
      (app) => app.date === todayDate && !app.therapy
    );
    const upcoming = appointments.filter(
      (app) => new Date(app.date) > new Date()
    );
    console.log(todayDate);
    console.log(
      appointments.filter((app) => app.date === todayDate && !app.therapy)
    );
    console.log("Filtered today's appointments: ", todays);
    setTodaysAppointments(todays);

    setUpcomingAppointments(upcoming);
  };

  useEffect(() => {
    fetchBookedAppointments();
  }, [userId]);

  return (
    <>
      <nav>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingRight: "1rem",
            flexWrap: "wrap",
          }}
        >
          <NavLink
            to={`/indexDoctor/${userId}`}
            style={({ isActive }) => ({
              backgroundColor: isActive ? " #005cbf" : "",
            })}
          >
            Home
          </NavLink>
          <NavLink
            to={`/setavailability/${userId}`}
            style={({ isActive }) => ({
              backgroundColor: isActive ? " #005cbf" : "",
            })}
          >
            Set Availability
          </NavLink>
          <NavLink
            to={`/upcomingappointments/${userId}`}
            style={({ isActive }) => ({
              backgroundColor: isActive ? " #005cbf" : "",
            })}
          >
            Upcoming Appointments
          </NavLink>
          <NavLink
            to={`/appointmentsTable/${userId}`}
            style={({ isActive }) => ({
              backgroundColor: isActive ? " #005cbf" : "",
            })}
          >
            List of Appointments
          </NavLink>
          <NavLink
            to={`/register`}
            style={({ isActive }) => ({
              backgroundColor: isActive ? " #005cbf" : "",
            })}
          >
            Register Patient
          </NavLink>
          <button onClick={() => setDetailsVisible(!detailsVisible)}>
            {detailsVisible ? "Hide Details" : "Show Details"}
          </button>
          <LogoutButton style={{ marginLeft: "5rem" }} />
        </div>
      </nav>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingRight: "1rem",
          }}
        >
          <h1 style={{ color: "white" }}>
            {" "}
            &nbsp;Welcome, Dr. {doctorDetails?.name}!
          </h1>
        </div>

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
          <h2>Today's Appointments</h2>
          <div className="appointments-row">
            {console.log(todaysAppointments)}
            {todaysAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                Patient's name: {appointment.patientName}
                <br />
                Date: {appointment.date}
                <br />
                Time: {appointment.time}
                <br />
                Reason: {appointment.reason}
                <br />
                <button
                  onClick={() => setCurrentDiagnosisAppointment(appointment.id)}
                >
                  Add Diagnosis and Therapy
                </button>
                {currentDiagnosisAppointment === appointment.id && (
                  <div className="modal">
                    <br></br>
                    <br></br>
                    <button
                      className="close-btn"
                      onClick={() => setCurrentDiagnosisAppointment(null)}
                    >
                      &times;
                    </button>
                    <textarea
                      value={diagnosisText}
                      onChange={handleDiagnosisChange}
                      placeholder="Enter diagnosis..."
                    ></textarea>
                    <textarea
                      value={therapyText}
                      onChange={handleTherapyChange}
                      placeholder="Enter therapy..."
                    ></textarea>
                    <textarea
                      value={extraInfo}
                      onChange={handleInfoChange}
                      placeholder="Enter link for extra info..."
                    ></textarea>
                    <input type="file" onChange={handleFileChange} />
                    <button
                      onClick={() => {
                        handleFileUpload(uploadingFile, appointment.id);
                      }}
                    >
                      Upload File
                    </button>
                    <br></br>

                    <button
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "0.5em 1em",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleSaveDiagnosisAndTherapy(appointment.id);
                        setCurrentDiagnosisAppointment(null);
                      }}
                    >
                      Save Diagnosis and Therapy
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorPage;
