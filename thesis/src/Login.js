import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';




function LoginPage() {
  const auth = getAuth(); // initialize auth
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isDoctor, setIsDoctor] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    const db = getFirestore();

    // Create a query against the collection
    const q = query(collection(db, "doctors"), where("email", "==", formData.email));

    const querySnapshot = await getDocs(q);
    
    // If no docs were found, querySnapshot will be empty
    if ((!querySnapshot.empty && isDoctor) || (querySnapshot.empty && !isDoctor)) {
      const userId = userCredential.user.uid;
      navigate(isDoctor ? `/indexDoctor/${userId}` : `/indexPatient/${userId}`);
    } else {
      setError('Invalid role selection!');
    }
  } catch (error) {
    setError('Invalid email or password!');
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
          Email:
          <input type="text" name="email" onChange={handleChange} required />
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
      <button onClick={() => navigate(isDoctor ? '/registerdoc' : '/register')}>Register</button>    </div>
  );
}

export default LoginPage;
