import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isDoctor, setIsDoctor] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userCollection = isDoctor ? 'doctors' : 'patients';
    const userQuery = await getDocs(query(collection(db, userCollection), where("username", "==", formData.username)));

    if (userQuery.empty) {
      setError('Username does not exist. If you have not registered please do!');
    } else {
      const userData = userQuery.docs[0].data();
      if (userData.password !== formData.password) {
        setError('Incorrect password!');
      } else {
        window.location.href = isDoctor ? 'http://localhost:3000/indexDoctor.js' : 'http://localhost:3000/indexPatient.js';
      }
    }    
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Are you a doctor?
          <input type="checkbox" checked={isDoctor} onChange={(e) => setIsDoctor(e.target.checked)} />
        </label>
        <br />
        <label>
          Username:
          <input type="text" name="username" onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <div className="error">{error}</div>}
      <button onClick={() => window.location.href = isDoctor ? 'http://localhost:3000/registerdoc' : 'http://localhost:3000/register'}>Register</button>
    </div>
  );
}

export default LoginPage;

