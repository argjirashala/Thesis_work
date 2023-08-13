import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, setDoc, collection,  getDocs ,updateDoc,getDoc} from "firebase/firestore";
import { query, where } from 'firebase/firestore';


function EditDoctor() {
  const { id } = useParams(); // Get the doctor's ID from the URL
  const [formData, setFormData] = useState({
    personalID: '',
    name: '',
    surname: '',
    birthday: '',
    gender: '',
    clinic: '',
    address: '',
    phone: '',
    specialization: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState([]);
  const db = getFirestore();
  

  // Fetch doctor's data when component loads
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
    setErrors([]); // Clear errors when field value changes
  };

  // Rest of the component remains largely the same as RegisterDoc.
  // However, instead of setDoc, use updateDoc on handleSubmit.

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = [];

    const emailPattern = /^\S+@\S+\.\S+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    const namePattern = /^[a-zA-Z]+$/;

    // Check if all fields are filled
    if (Object.values(formData).some(value => value === "")) {
      newErrors.push("All fields must be filled!");
    }

    // Check if names only contain letters
    if (!(namePattern.test(formData.name) && namePattern.test(formData.surname))) {
      newErrors.push("Name and surname should only contain letters");
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match!");
    }

    // Check if password length is between 8 and 20 characters, contains at least one number and rest can be letters
    if (!passwordPattern.test(formData.password)) {
      newErrors.push("Password should be between 8 and 20 characters and contain at least one number.");
    }

    // Check if email is valid
    if (!emailPattern.test(formData.email)) {
      newErrors.push("Invalid email format.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Query firestore for uniqueness of personalID, email and username
    // Query firestore for uniqueness of personalID, email and username
const personalIDExists = await (await getDocs(query(collection(db, "doctors"), where("personalID", "==", formData.personalID), where("__name__", "!=", id)))).size > 0;
const emailExists = await (await getDocs(query(collection(db, "doctors"), where("email", "==", formData.email), where("__name__", "!=", id)))).size > 0;

    if (personalIDExists || emailExists) {
      setErrors(["User already exist!"]);
      return;
    }

    // ... your validation logic

    try {
      const docRef = doc(db, "doctors", id);
      await updateDoc(docRef, formData);

      setErrors(["Update was successful!"]);
    } catch (error) {
      setErrors([`Error updating document: ${error}`]);
    }
  };

  return (
    <div>
      <h1>Edit Doctor</h1>
      <form onSubmit={handleSubmit}>
        {/* Rest of your form fields */}
        <label>
          Personal ID:
          <input type="text" name="personalID" onChange={handleChange} />
        </label>
        <br></br>
        <label>
          Name:
          <input type="text" name="name" onChange={handleChange} />
        </label>
        <br></br>
        <label>
          Surname:
          <input type="text" name="surname" onChange={handleChange} />
        </label>
        <br></br>
        <label>
          Birthday:
          <input type="date" name="birthday" onChange={handleChange} />
        </label>
        <br></br>
        <label>
  Gender:
  <select name="gender" onChange={handleChange}>
    <option value="">Select...</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="not_specified">Not Specified</option>
  </select>
</label>
<br></br>
<label>
          Clinic name:
          <input type="text" name="clinic" onChange={handleChange} />
        </label>
        <br></br>
        <label>
  Specialization:
  <select name="specialization" onChange={handleChange}>
    <option value="">Select...</option>
    <option value="AerospaceMedicineSpecialist">Aerospace Medicine Specialist</option>
    <option value="Allergist">Allergist</option>
    <option value="Anaesthesiologist">Anaesthesiologist</option>
    <option value="Andrologist">Andrologist</option>
    <option value="Cardiologist">Cardiologist</option>
    <option value="Cardiac Electrophysiologist">Cardiac Electrophysiologist</option>
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
    <option value="EmergencyRoomDoctor">Emergency Room (ER) Doctor</option>
    <option value="Endocrinologist">Endocrinologist</option>
    <option value="Epidemiologist">Epidemiologist</option>
    <option value="Family Medicine Physician">Family Medicine Physician</option>
    <option value="Gastroenterologist">Gastroenterologist</option>
    <option value="Geriatrician">Geriatrician</option>
    <option value="Hyperbarichysician">Hyperbaric Physician</option>
    <option value="Hematologist">Hematologist</option>
    <option value="Hepatologist">Hepatologist</option>
    <option value="Immunologist">Immunologist</option>
    <option value="InfectiousDiseaseSpecialist">Infectious Disease Specialist</option>
    <option value="Intensivist">Intensivist</option>
    <option value="Neonatologist">Neonatologist</option>
    <option value="Nephrologist">Nephrologist</option>
    <option value="Neurologist">Neurologist</option>
    <option value="Neurosurgeon">Neurosurgeon</option>
    <option value="Obstetrician/Gynecologist">Obstetrician/Gynecologist</option>
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
          <input type="text" name="address" onChange={handleChange} />
        </label>
        <br></br>
        <label>
          Phone:
          <input type="number" name="phone" onChange={handleChange} />
        </label>
        <br></br>
        <label>
          Email:
          <input type="text" name="email" onChange={handleChange} />
        </label>
        <br></br>
        <label>
          Password:
          <input type="password" name="password" onChange={handleChange} />
        </label>
        <br></br>
        <label>
          Confirm Password:
          <input type="password" name="confirmPassword" onChange={handleChange} />
        </label>
        <br></br>
        <br></br>
        {/* ... */}
        <button type="submit">Edit</button>
        <br></br>
        <br></br>
        {errors.length > 0 && (
          <div style={{backgroundColor: 'pink', width: '400px', height: '200px'}}>
          {errors.map((error, index) => <li key={index}>{error}</li>)}
        </div>
        )}
      </form>
    </div>
    // ... your render logic, which should be very similar to RegisterDoc
  );
}

export default EditDoctor;
