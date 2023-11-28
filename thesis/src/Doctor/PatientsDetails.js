import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import "./Doctor.css";
import EditPatientModal from "./EditPatientModal";

function PatientDetailsTable() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const db = getFirestore();
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [surnameFilter, setSurnameFilter] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      const diagnosisQuery = query(
        collection(db, "appointments"),
        where("diagnosis", "!=", "")
      );
      const therapyQuery = query(
        collection(db, "appointments"),
        where("therapy", "!=", "")
      );
      const diagnosisSnapshot = await getDocs(diagnosisQuery);
      const therapySnapshot = await getDocs(therapyQuery);

      const diagnosisPatients = diagnosisSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const therapyPatients = therapySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const patientsData = [...diagnosisPatients];

      for (let data of patientsData) {
        const patientRef = doc(db, "patients", data.patientId);
        const patientSnapshot = await getDoc(patientRef);

        if (patientSnapshot.exists()) {
          data.patientName = patientSnapshot.data().name;
          data.patientSurname = patientSnapshot.data().surname;
        }
      }
      setPatients(patientsData);
    };

    fetchPatients();
  }, [db]);

  const handleSave = async (editedData) => {
    try {
      const appointmentRef = doc(db, "appointments", editingPatient.id);
      await setDoc(
        appointmentRef,
        { ...editingPatient, ...editedData },
        { merge: true }
      );

      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === editingPatient.id ? { ...p, ...editedData } : p
        )
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const filterPatients = () => {
    return patients.filter((patient) => {
      const matchesDate = selectedDate
        ? new Date(patient.date).toDateString() === selectedDate.toDateString()
        : true;
      const matchesName = nameFilter
        ? patient.patientName.toLowerCase().includes(nameFilter.toLowerCase())
        : true;
      const matchesSurname = surnameFilter
        ? patient.patientSurname
            .toLowerCase()
            .includes(surnameFilter.toLowerCase())
        : true;

      return matchesDate && matchesName && matchesSurname;
    });
  };

  const filteredPatients = filterPatients();

  return (
    <div className="booked-appointments">
      <h2>List of Appointments</h2>
      {/* <div className="filter-section">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          isClearable
          placeholderText="Filter by date"
        />
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by surname"
          value={surnameFilter}
          onChange={(e) => setSurnameFilter(e.target.value)}
        />
      </div> */}
      <table>
        <thead>
          <tr className="filter-row">
            <th>
              <input
                type="text"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Filter by surname"
                value={surnameFilter}
                onChange={(e) => setSurnameFilter(e.target.value)}
              />
            </th>
            <th>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                isClearable
                placeholderText="Filter by date"
              />
            </th>
            <th colspan="2"></th>
          </tr>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Date</th>
            <th>Details</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.patientName}</td>
              <td>{patient.patientSurname}</td>
              <td>{patient.date}</td>
              <td>
                <button onClick={() => setSelectedPatient(patient)}>
                  Details
                </button>
              </td>
              <td>
                <button onClick={() => setEditingPatient(patient)}>Edit</button>
              </td>

              {editingPatient && (
                <EditPatientModal
                  patient={editingPatient}
                  onClose={() => setEditingPatient(null)}
                  onSave={handleSave}
                />
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedPatient && (
        <div className="modal">
          <button
            className="close-btn"
            onClick={() => setSelectedPatient(null)}
          >
            &times;
          </button>
          <h3>Diagnosis</h3>
          <p>{selectedPatient.diagnosis}</p>
          <h3>Therapy</h3>
          <p>{selectedPatient.therapy}</p>
          <h3>Link for extra information</h3>
          <p>{selectedPatient.info}</p>
          {selectedPatient.fileURL && (
            <iframe className="iframe" src={selectedPatient.fileURL}></iframe>
          )}
        </div>
      )}
    </div>
  );
}

export default PatientDetailsTable;
