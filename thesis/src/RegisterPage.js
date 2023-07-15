import React, { useState } from 'react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

function RegisterPage() {
  const [formData, setFormData] = useState({
    personalID: '',
    name: '',
    surname: '',
    birthday: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors([]); // Clear errors when field value changes
  };

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
      newErrors.push("Password should be between 8 and 20 characters, contain at least one number, and the rest can be letters.");
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
    const personalIDExists = await (await getDocs(query(collection(db, "patients"), where("personalID", "==", formData.personalID)))).size > 0;
    const emailExists = await (await getDocs(query(collection(db, "patients"), where("email", "==", formData.email)))).size > 0;
    const usernameExists = await (await getDocs(query(collection(db, "patients"), where("username", "==", formData.username)))).size > 0;

    if (personalIDExists || emailExists || usernameExists) {
      setErrors(["Personal ID, email or username already exists. They must be unique."]);
      return;
    }

    try {
        await addDoc(collection(db, "patients"), formData);
        setErrors(["Registration successful!"]);
    } catch (error) {
        setErrors([`Error adding document: ${error}`]);
    }
  };

  return (
    <div>
      <h1>Register</h1>
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
          Username:
          <input type="text" name="username" onChange={handleChange} />
        </label>
        <label>
        <br></br>
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
        <button type="submit">Register</button>
        <br></br>
        <br></br>
        {errors.length > 0 && (
          <div style={{backgroundColor: 'pink', width: '400px', height: '200px'}}>
          {errors.map((error, index) => <li key={index}>{error}</li>)}
        </div>
        )}
      </form>
    </div>
  );
}



export default RegisterPage;
