import React, { useState } from 'react';
import { addDoc, setDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import './Register.css';
import { useNavigate } from "react-router-dom";




function RegisterPage() {
  const auth = getAuth(); 
  const [formData, setFormData] = useState({
    personalID: '',
    name: '',
    surname: '',
    birthday: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState([]);
  let navigate = useNavigate();

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


    if (Object.values(formData).some(value => value === "")) {
      newErrors.push("All fields must be filled!");
    }


    if (!(namePattern.test(formData.name) && namePattern.test(formData.surname))) {
      newErrors.push("Name and surname should only contain letters");
    }


    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match!");
    }

    if (!passwordPattern.test(formData.password)) {
      newErrors.push("Password should be between 8 and 20 characters, contain at least one number, and the rest can be letters.");
    }

    if (!emailPattern.test(formData.email)) {
      newErrors.push("Invalid email format.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const personalIDExists = (await getDocs(query(collection(db, "patients"), where("personalID", "==", formData.personalID)))).size > 0;
    const emailExists = (await getDocs(query(collection(db, "patients"), where("email", "==", formData.email)))).size > 0;


    if (personalIDExists || emailExists) {
      setErrors(["User already exists!"]);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      delete formData.password;
      delete formData.confirmPassword;

      const patientRef = doc(db, "patients", uid);

      await setDoc(patientRef, formData);

      

      alert(["Registration was successful!"]);
      navigate("/");
    } catch (error) {
      setErrors([`Error adding document: ${error}`]);
    }
  };
  

  return (
    <div className='register-wrapper'>
      <div className='parent-container'>
      <div className='register-form'>
      <form className='mainForm' onSubmit={handleSubmit}>
      <div className='register forms form-style'>
        <label>
          Personal ID:
          <input type="text" name="personalID" onChange={handleChange} required className='input input-field' />
        </label>
        <br></br>
        <label>
          Name:
          <input type="text" name="name" onChange={handleChange} required className='input input-field' />
        </label>
        <br></br>
        <label>
          Surname:
          <input type="text" name="surname" onChange={handleChange} required className='input input-field'/>
        </label>
        <br></br>
        <label>
          Birthday:
          <input type="date" name="birthday" onChange={handleChange} required className='input input-field'/>
        </label>
        <br></br>
        <label>
  Gender:
  <select name="gender" onChange={handleChange} required className='input input-field'>
    <option value="">Select...</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="not_specified">Not Specified</option>
  </select>
</label>
<br></br>
        <label>
          Address:
          <input type="text" name="address" onChange={handleChange} required className='input input-field' />
        </label>
        <br></br>
        <label>
          Phone:
          <input type="number" name="phone" onChange={handleChange} required className='input input-field'  />
        </label>
        <br></br>
        <label>
          Email:
          <input type="text" name="email" onChange={handleChange} required className='input input-field' />
        </label>
        <br></br>
        <label>
          Password:
          <input type="password" name="password" onChange={handleChange} required className='input input-field'  />
        </label>
        <br></br>
        <label>
          Confirm Password:
          <input type="password" name="confirmPassword" onChange={handleChange} required className='input input-field' />
        </label>
        <br></br>
        <br></br>
        {/* ... */}
        <button type="submit" className='input submit'>Register</button>
        <br></br>
        <br></br>
        {errors.length > 0 && (
          <div style={{backgroundColor: 'pink', width: '400px', height: '100px'}}>
          {errors.map((error, index) => <li key={index}>{error}</li>)}
        </div>
        )}
        </div>
      </form>
    </div>
    </div>
    </div>
  );
}



export default RegisterPage;
