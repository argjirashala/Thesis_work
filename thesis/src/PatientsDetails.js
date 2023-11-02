import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import './Patient.css';
import EditPatientModal from "./EditPatientModal";



function PatientDetailsTable() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const db = getFirestore();
    const [editingPatient, setEditingPatient] = useState(null);

  
    useEffect(() => {
        const fetchPatients = async () => {
          const diagnosisQuery = query(collection(db, "appointments"), where("diagnosis", "!=", ""));
          const therapyQuery = query(collection(db, "appointments"), where("therapy", "!=", ""));
          const diagnosisSnapshot = await getDocs(diagnosisQuery);
          const therapySnapshot = await getDocs(therapyQuery);
          
          const diagnosisPatients = diagnosisSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          const therapyPatients = therapySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
          const patientsData = [...diagnosisPatients, ...therapyPatients];
      
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
          await setDoc(appointmentRef, { ...editingPatient, ...editedData }, { merge: true });
          
          setPatients((prevPatients) =>
            prevPatients.map((p) =>
              p.id === editingPatient.id ? { ...p, ...editedData } : p
            )
          );
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      };
      
      
    return (
        <div className="booked-appointments">
          <h2>List of Patients</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Surname</th>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.patientName}</td>
                  <td>{patient.patientSurname}</td>
                  <td>{patient.date}</td>
                  <button onClick={() => setSelectedPatient(patient)}>Details</button>
                  <button onClick={() => setEditingPatient(patient)}>Edit</button>
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
              <button className="close-btn" onClick={() => setSelectedPatient(null)}>&times;</button>
              <h3>Diagnosis</h3>
              <p>{selectedPatient.diagnosis}</p>
              <h3>Therapy</h3>
              <p>{selectedPatient.therapy}</p>
              {selectedPatient.fileURL && (
            <iframe className="iframe" src={selectedPatient.fileURL}></iframe>
        )}
        
            </div>
          )}
        </div>
      );
    }
    
    export default PatientDetailsTable;