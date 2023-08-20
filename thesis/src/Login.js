import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Login.css';



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
    if (userCredential.user.email === 'admin@admin.com') {
      navigate('/indexAdmin');
    }
    else if ((!querySnapshot.empty && isDoctor) || (querySnapshot.empty && !isDoctor)) {
      const userId = userCredential.user.uid;
      navigate(isDoctor ? `/indexDoctor/${userId}` : `/indexPatient/${userId}`);
    } else {
      alert('Invalid role selection!');
    }
  } catch (error) {
    alert('Invalid email or password!');
  }        
};

const handleForgotPassword = async () => {
  const email = formData.email;

  if (!email) {
    alert('Please enter your email to reset password.');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent! Check your inbox.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    setError('Error sending password reset email. Please try again.');
  }
};
  

  return (
    <div className='login-wrapper'>
      <div className='parent-container'>
      <div className='login-form'>
      {/* <h1>Login</h1> */}
      <form className='mainForm' onSubmit={handleSubmit}>
      <div className='login forms form-style'>
        <label>
          Are you a doctor?
          <input type="checkbox" checked={isDoctor} onChange={(e) => setIsDoctor(e.target.checked)} />
        </label>
        <br />
        <br></br>
        <label>
          Email:
          <input type="text" name="email" onChange={handleChange} required className='input input-field' />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" onChange={handleChange} required className='input input-field'/>
        </label>
        <br />
        <button type="submit" className='input submit'>Login</button>
        <br/>
        <button type="button" onClick={handleForgotPassword} className='input forgot-password'>Forgot Password?</button>
        </div> 
      </form>
      {error && <div className="error">{error}</div>}
      <div className='register-box'>
      <p>Please register in case you haven't done so. Don't forget to check the box if you're a doctor!</p>
      <button type="button" className='register-button' onClick={() => navigate(isDoctor ? '/registerdoc' : '/register')} >Register</button>
      </div>
      </div>   
       </div>
       </div>
  );
}

export default LoginPage;
