import { deleteDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, setDoc, collection,  getDocs } from "firebase/firestore";
import { Link } from 'react-router-dom';
import LogoutButton from "./LogoutButton";


function AdminPage() {
    const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const db = getFirestore();
  useEffect(() => {
    const fetchUsers = async () => {
      const doctorsData = await getDocs(collection(db, "doctors"));
      const patientsData = await getDocs(collection(db, "patients"));
  
      // Update the way you set state to include the doc IDs
      setDoctors(doctorsData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setPatients(patientsData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  
      console.log(doctorsData);
    }
  
    fetchUsers();
  }, []);
  

  const editUser = (userType, id) => {
    const newName = prompt("Enter new name");
    const newSurname = prompt("Enter new surname");
  
    if (newName && newSurname) {
      const userRef = doc(db, userType, id);
      setDoc(userRef, { name: newName, surname: newSurname }, { merge: true });
    }
  }

  const deleteUser = async (userType, id) => {
    if (window.confirm("Are you sure? This will delete the user permanently.")) {
      const userRef = doc(db, userType, id);
      await deleteDoc(userRef);
    }
  }


return(
  <><LogoutButton /><div>
    <div className="booked-appointments">
      <h2>Doctors</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.id}>
              <td>{doctor.name}</td>
              <td>{doctor.surname}</td>
              <td>{doctor.email}</td>
              <td>
                {/* <button onClick={() => editUser('doctors', doctor.id)}>Edit</button> */}
                <button>
                  <Link to={`/editDoctor/${doctor.id}`}>Edit</Link>
                </button>
                <button onClick={() => deleteUser('doctors', doctor.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="booked-appointments">

      {/* Similar table for patients... */}
      <h2>Patients</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.surname}</td>
              <td>{patient.email}</td>
              <td>
                <button>
                  <Link to={`/editPatient/${patient.id}`}>Edit</Link>
                </button>
                <button onClick={() => deleteUser('patients', patient.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div></>
)

  

}

export default AdminPage;