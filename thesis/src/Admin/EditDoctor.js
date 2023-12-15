import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { query, where } from "firebase/firestore";

function EditDoctor() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    personalID: "",
    name: "",
    surname: "",
    birthday: "",
    gender: "",
    clinic: "",
    address: "",
    phone: "",
    specialization: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchDoctor = async () => {
      const docRef = doc(db, "doctors", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        console.log("No such doctor!");
      }
    };

    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = [];

    const emailPattern = /^\S+@\S+\.\S+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    const namePattern = /^[a-zA-Z]+$/;

    if (Object.values(formData).some((value) => value === "")) {
      newErrors.push("All fields must be filled!");
    }

    if (
      !(namePattern.test(formData.name) && namePattern.test(formData.surname))
    ) {
      newErrors.push("Name and surname should only contain letters");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match!");
    }

    if (!passwordPattern.test(formData.password)) {
      newErrors.push(
        "Password should be between 8 and 20 characters and contain at least one number."
      );
    }

    if (!emailPattern.test(formData.email)) {
      newErrors.push("Invalid email format.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const personalIDExists =
      (await (
        await getDocs(
          query(
            collection(db, "doctors"),
            where("personalID", "==", formData.personalID),
            where("__name__", "!=", id)
          )
        )
      ).size) > 0;
    const emailExists =
      (await (
        await getDocs(
          query(
            collection(db, "doctors"),
            where("email", "==", formData.email),
            where("__name__", "!=", id)
          )
        )
      ).size) > 0;

    if (personalIDExists || emailExists) {
      setErrors(["User already exist!"]);
      return;
    }

    try {
      const docRef = doc(db, "doctors", id);
      await updateDoc(docRef, formData);

      alert(["Update was successful!"]);
    } catch (error) {
      setErrors([`Error updating document: ${error}`]);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="parent-container">
        <div className="register-form">
          <form onSubmit={handleSubmit} className="mainFormRegister">
            <label>
              Personal ID:
              <input
                data-testId="personalID"
                type="text"
                name="personalID"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label>
              Name:
              <input
                data-testId="name"
                type="text"
                name="name"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label>
              Surname:
              <input
                data-testId="surname"
                type="text"
                name="surname"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label>
              Birthday:
              <input
                data-testId="date"
                type="date"
                name="birthday"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label>
              Gender:
              <select
                data-testId="gender"
                name="gender"
                onChange={handleChange}
                required
                className="input input-field"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <br></br>
            <label>
              Clinic name:
              <input
                data-testId="clinic"
                type="text"
                name="clinic"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label>
              Specialization:
              <select
                data-testId="specialization"
                name="specialization"
                onChange={handleChange}
                required
                className="input input-field"
              >
                <option value="">Select...</option>
                <option value="AerospaceMedicineSpecialist">
                  Aerospace Medicine Specialist
                </option>
                <option value="Allergist">Allergist</option>
                <option value="Anaesthesiologist">Anaesthesiologist</option>
                <option value="Andrologist">Andrologist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Cardiac Electrophysiologist">
                  Cardiac Electrophysiologist
                </option>
                <optgroup label="DentalCare">
                  <option value="GeneralDentist">General Dentist</option>
                  <option value="Pedodontist">Pedodontist</option>
                  <option value="Orthodontist">Orthodontist</option>
                  <option value="Periodontist">Periodontist</option>
                  <option value="Endodontist">Endodontist</option>
                  <option value="OralSurgeon">Oral Surgeon</option>
                  <option value="Prosthodontist">Prosthodontist</option>
                </optgroup>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Dietitian/Dietician">Dietitian/Dietician</option>
                <option value="EmergencyRoomDoctor">
                  Emergency Room (ER) Doctor
                </option>
                <option value="Endocrinologist">Endocrinologist</option>
                <option value="Epidemiologist">Epidemiologist</option>
                <option value="Family Medicine Physician">
                  Family Medicine Physician
                </option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Geriatrician">Geriatrician</option>
                <option value="Hyperbarichysician">Hyperbaric Physician</option>
                <option value="Hematologist">Hematologist</option>
                <option value="Hepatologist">Hepatologist</option>
                <option value="Immunologist">Immunologist</option>
                <option value="InfectiousDiseaseSpecialist">
                  Infectious Disease Specialist
                </option>
                <option value="Intensivist">Intensivist</option>
                <option value="Neonatologist">Neonatologist</option>
                <option value="Nephrologist">Nephrologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Neurosurgeon">Neurosurgeon</option>
                <option value="Obstetrician/Gynecologist">
                  Obstetrician/Gynecologist
                </option>
                <option value="Oncologist">Oncologist</option>
                <option value="Ophthalmologist">Ophthalmologist</option>
                <option value="Orthopedist">Orthopedist</option>
                <option value="Parasitologist">Parasitologist</option>
                <option value="Pathologist">Pathologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Physiatrist">Physiatrist</option>
                <option value="PlasticSurgeon">Plastic Surgeon</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Pulmonologist">Pulmonologist</option>
                <option value="Radiologist">Radiologist</option>
                <option value="Urologist">Urologist</option>
                <option value="VascularSurgeon">Vascular Surgeon</option>
                <option value="Veterinarian">Veterinarian</option>
              </select>
            </label>
            <br></br>
            <label>
              Address:
              <input
                data-testId="address"
                type="text"
                name="address"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label>
              Phone:
              <input
                data-testId="phone"
                type="number"
                name="phone"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label>
              Email:
              <input
                data-testId="email"
                type="text"
                name="email"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label>
              Password:
              <input
                data-testId="password"
                type="password"
                name="password"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label>
              Confirm Password:
              <input
                data-testId="confirmPassword"
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <br></br>
            {/* ... */}
            <button
              style={{
                backgroundColor: "green",
                justifyContent: "center",
                alignContent: "center",
                color: "white",
                padding: "0.5em 1em",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              data-testId="submit"
              name="edit"
              type="submit"
              className="input submit"
            >
              Edit
            </button>
            <br></br>
            <br></br>
            {errors.length > 0 && (
              <div className="error-div">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditDoctor;
