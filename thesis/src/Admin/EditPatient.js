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

function EditPatient() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    personalID: "",
    name: "",
    surname: "",
    birthday: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchPatient = async () => {
      const patientRef = doc(db, "patients", id);
      const patientSnap = await getDoc(patientRef);

      if (patientSnap.exists()) {
        setFormData(patientSnap.data());
      } else {
        console.log("No such patient!");
      }
    };

    fetchPatient();
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
        "Password should be between 8 and 20 characters, contain at least one number, and the rest can be letters."
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
            collection(db, "patients"),
            where("personalID", "==", formData.personalID),
            where("__name__", "!=", id)
          )
        )
      ).size) > 0;
    const emailExists =
      (await (
        await getDocs(
          query(
            collection(db, "patients"),
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
      const patientRef = doc(db, "patients", id);
      await updateDoc(patientRef, formData);

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
            <label htmlFor="personalID">
              Personal ID:
              <input
                data-testid="testid"
                type="text"
                name="personalID"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label htmlFor="name">
              Name:
              <input
                data-testid="testname"
                type="text"
                name="name"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label htmlFor="surname">
              Surname:
              <input
                data-testid="surname"
                type="text"
                name="surname"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label htmlFor="date">
              Birthday:
              <input
                data-testid="date"
                type="date"
                name="birthday"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label htmlFor="gender">
              Gender:
              <select
                data-testid="gender"
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
            <label htmlFor="address">
              Address:
              <input
                data-testid="address"
                type="text"
                name="address"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label htmlFor="phone">
              Phone:
              <input
                data-testid="phone"
                type="number"
                name="phone"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label htmlFor="email">
              Email:
              <input
                data-testid="email"
                type="text"
                name="email"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label htmlFor="password">
              Password:
              <input
                data-testid="password"
                type="password"
                name="password"
                onChange={handleChange}
                required
                className="input input-field"
              />
            </label>
            <br></br>
            <label htmlFor="confirmPassword">
              Confirm Password:
              <input
                data-testid="confirmPassword"
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
            <button data-testId="submit" type="submit" className="input submit">
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

export default EditPatient;
