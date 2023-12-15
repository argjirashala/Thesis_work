import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
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
import "../Patient/Modal.css";
import "./Doctor.css";
import LogoutButton from "../Logout/LogoutButton";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { NavLink } from "react-router-dom";

function SetAvailability() {
  const { userId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const db = getFirestore();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState(null);

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
      } else {
        console.error("No such document!");
      }
    };

    fetchDoctorDetails();
  }, [userId]);

  const handleAddSlot = () => {
    setError(null);

    if (startTime >= endTime) {
      console.log("Error condition met!");
      setError("End time should be after start time.");
      return;
    }

    const dateKey = selectedDate.toISOString().split("T")[0];
    const newSlot = `${startTime}-${endTime}`;
    setAvailability((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newSlot],
    }));
    setStartTime("");
    setEndTime("");
  };

  const handleRemoveSlot = (slotToRemove) => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    setAvailability((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((slot) => slot !== slotToRemove),
    }));
  };

  const dateKey = selectedDate.toISOString().split("T")[0];
  const selectedTimeSlots = availability[dateKey] || [];

  useEffect(() => {
    console.log("Error state changed to:", error);
  }, [error]);

  const handleSaveAvailability = async () => {
    const docRef = doc(db, "doctors", userId);
    await setDoc(docRef, { availability }, { merge: true });
    alert("Availability saved successfully!");
    setSelectedDate(new Date());
    setStartTime("");
    setEndTime("");
  };

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
        <h2>Set Your Availability</h2>

        <div className="availability-section">
          <div className="time-picker-container">
            <label style={{ fontWeight: "bold" }}>Date:</label>
            <DatePicker
              className="input input-field"
              selected={selectedDate}
              onChange={setSelectedDate}
            />
            <br></br>
            <div className="time-inputs">
              <div>
                <label>Start Time:</label>
                <input
                  type="time"
                  className="input input-field"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label>End Time:</label>
                <input
                  type="time"
                  className="input input-field"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="add-slot-button-container">
              <button onClick={handleAddSlot} disabled={startTime >= endTime}>
                Add Slot
              </button>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="slots-container">
            <br></br>
            {selectedTimeSlots.map((slot, index) => (
              <div key={index} className="slot-item">
                <div className="slot-text">{slot}</div>
                <button
                  className="remove-slot-button"
                  onClick={() => handleRemoveSlot(slot)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {selectedTimeSlots.length > 0 && (
            <div className="add-slot-button-container">
              <button onClick={handleSaveAvailability}>
                Save Availability
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SetAvailability;
