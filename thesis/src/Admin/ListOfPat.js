import { deleteDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import LogoutButton from "../Logout/LogoutButton";

function ListOfPat() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const db = getFirestore();
  useEffect(() => {
    const fetchUsers = async () => {
      const doctorsData = await getDocs(collection(db, "doctors"));
      const patientsData = await getDocs(collection(db, "patients"));
      setDoctors(
        doctorsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      setPatients(
        patientsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      console.log(doctorsData);
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userType, id) => {
    if (
      window.confirm("Are you sure? This will delete the user permanently.")
    ) {
      const userRef = doc(db, userType, id);
      await deleteDoc(userRef);
    }
  };

  return (
    <>
      <nav>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingRight: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {" "}
            <NavLink
              to={`/indexAdmin`}
              style={({ isActive }) => ({
                backgroundColor: isActive ? " #005cbf" : "",
              })}
            >
              List of Doctors
            </NavLink>
            <NavLink
              to={`/patienttable`}
              style={({ isActive }) => ({
                backgroundColor: isActive ? " #005cbf" : "",
              })}
            >
              List of Patients
            </NavLink>
            <NavLink
              to={`/registerdoc`}
              style={({ isActive }) => ({
                backgroundColor: isActive ? " #005cbf" : "",
              })}
            >
              Register Doctor
            </NavLink>
            <NavLink
              to={`/register`}
              style={({ isActive }) => ({
                backgroundColor: isActive ? " #005cbf" : "",
              })}
            >
              Register Patient
            </NavLink>
          </div>
          <LogoutButton style={{ marginLeft: "auto" }} />{" "}
        </div>
      </nav>
      <div className="booked-appointments">
        <h2>Patients</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.surname}</td>
                <td>{patient.email}</td>
                <td>
                  <button>
                    <Link
                      style={{ color: "black" }}
                      to={`/editPatient/${patient.id}`}
                    >
                      Edit
                    </Link>
                  </button>
                </td>
                <td>
                  <button
                    style={{ backgroundColor: "red", color: "white" }}
                    onClick={() => deleteUser("patients", patient.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ListOfPat;
