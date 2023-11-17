// import React, { useState } from 'react';
// import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail } from 'firebase/auth';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';



// function LoginPage() {
//   const auth = getAuth(); 
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [isDoctor, setIsDoctor] = useState(false);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

  

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
//     const db = getFirestore();

//     const q = query(collection(db, "doctors"), where("email", "==", formData.email));

//     const querySnapshot = await getDocs(q);
    
//     if (userCredential.user.email === 'admin@admin.com') {
//       navigate('/indexAdmin');
//     }
//     else if ((!querySnapshot.empty && isDoctor) || (querySnapshot.empty && !isDoctor)) {
//       const userId = userCredential.user.uid;
//       navigate(isDoctor ? `/indexDoctor/${userId}` : `/indexPatient/${userId}`);
//     } else {
//       alert('Invalid role selection!');
//     }
//   } catch (error) {
//     alert('Invalid email or password!');
//   }        
// };

// const handleForgotPassword = async () => {
//   const email = formData.email;

//   if (!email) {
//     alert('Please enter your email to reset password.');
//     return;
//   }

//   try {
//     await sendPasswordResetEmail(auth, email);
//     alert('Password reset email sent! Check your inbox.');
//   } catch (error) {
//     console.error('Error sending password reset email:', error);
//     setError('Error sending password reset email. Please try again.');
//   }
// };
  

//   return (
//     <div className='login-wrapper'>
//       <div className='parent-container'>
//       <div className='login-form'>
//       <form className='mainForm' onSubmit={handleSubmit}>
//       <div className='login forms form-style'>
//         <label>
//           Are you a doctor?
//           <input type="checkbox" checked={isDoctor} onChange={(e) => setIsDoctor(e.target.checked)} />
//         </label>
//         <br />
//         <br></br>
//         <label>
//           Email:
//           <input type="text" name="email" onChange={handleChange} required className='input input-field' />
//         </label>
//         <br />
//         <label>
//           Password:
//           <input type="password" name="password" onChange={handleChange} required className='input input-field'/>
//         </label>
//         <br />
//         <button type="submit" className='input submit'>Login</button>
//         <br/>
//         <button type="button" onClick={handleForgotPassword} className='input forgot-password'>Forgot Password?</button>
//         </div> 
//       </form>
//       {error && <div className="error">{error}</div>}
//       <div className='register-box'>
//       <p>Please register in case you haven't done so. Don't forget to check the box if you're a doctor!</p>
//       <button type="button" className='register-button' onClick={() => navigate(isDoctor ? '/registerdoc' : '/register')} >Register</button>
//       </div>
//       </div>   
//        </div>
//        </div>
//   );
// }

// export default LoginPage;
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function RoleSelectModal({ onSelect }) {
  return (
    <div className="modal">
      <p>Please select your role:</p>
      <button onClick={() => onSelect('doctor')}>Doctor</button>
      <button onClick={() => onSelect('patient')}>Patient</button>
    </div>
  );
}

function RegSelectModal({ onSelect }) {
  return (
    <div>
      <p>&nbsp;&nbsp;If you haven't register yet please do so:</p>
      &nbsp;&nbsp;<button onClick={() => onSelect('doctor')}>Register as Doctor</button>&nbsp;&nbsp;&nbsp;
      <button onClick={() => onSelect('patient')}>Register as Patient</button>
    </div>
  );
}

function LoginPage() {
  const auth = getAuth();
  const db = getFirestore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showRoleSelectModal, setShowRoleSelectModal] = useState(false);
  const [showRegSelectModal, setRegSelectModal] = useState(false);
  const [userId, setUserId] = useState(null);



  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  const handleRoleSelect = (role) => {
    setShowRoleSelectModal(false);
    if (role === 'doctor') {
      navigate(`/indexDoctor/${userId}`);
    } else {
      navigate(`/indexPatient/${userId}`);
    }
  };

 
  

  const handleRegSelect = (role) => {
    setRegSelectModal(false);
    if (role === 'doctor') {
      navigate(`/registerdoc`);
    } else {
      navigate(`/register`);
    }
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
  setUserId(userCredential.user.uid); // Set user ID here
      
      const doctorsQuery = query(collection(db, "doctors"), where("email", "==", formData.email));
      const patientsQuery = query(collection(db, "patients"), where("email", "==", formData.email));

      const [doctorsSnapshot, patientsSnapshot] = await Promise.all([
        getDocs(doctorsQuery),
        getDocs(patientsQuery)
      ]);

      

      const isDoctor = !doctorsSnapshot.empty;
      const isPatient = !patientsSnapshot.empty;

      // if (isDoctor && isPatient) {
      //   // Logic to prompt the user to choose a role
      //   const role = window.confirm("Are you logging in as a Doctor? Press OK for Doctor, Cancel for Patient.");
      //   const userId = userCredential.user.uid;
      //   navigate(role ? `/indexDoctor/${userId}` : `/indexPatient/${userId}`);
      if (userCredential.user.email === 'admin@admin.com') {
              navigate('/indexAdmin');
      }
      if (isDoctor && isPatient) {
        setShowRoleSelectModal(true);
      } else if (isDoctor) {
        navigate(`/indexDoctor/${userCredential.user.uid}`);
      } else if (isPatient) {
        navigate(`/indexPatient/${userCredential.user.uid}`);
      } 
      //else if(!isDoctor && !isPatient) {
        
      // }else{

      // }

    } catch (error) {
      console.error('Login error:', error);
      // const role = window.confirm('If you are not registered Please press OK to login as Doctor, Cancel to login as Patient.');
      // navigate(role ? `/registerdoc` : `/register`);
      setRegSelectModal(true);
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
    <body>
    <><div>
    {/* <div className="modal-overlay">
      <div className="modal-content"> */}
      {showRoleSelectModal && <RoleSelectModal onSelect={handleRoleSelect} />}
      {showRegSelectModal && <RegSelectModal onSelect={handleRegSelect} />}
        {/* </div>
        </div> */}
    </div><div className='login-wrapper'>
        <div className='parent-container'>
          <div className='login-form'>
            <form className='mainForm' onSubmit={handleSubmit}>
              <div className='login forms form-style'>
                <br />
                <br></br>

                <label>
                  Email:
                  <input type="text" name="email" onChange={handleChange} required className='input input-field' />
                </label>
                <br />
                <label>
                  Password:
                  <input type="password" name="password" onChange={handleChange} required className='input input-field' />
                </label>
                <br />
                <button type="submit" className='input submit'>Login</button>
                <br />
                <button type="button" onClick={handleForgotPassword} className='input forgot-password'>Forgot Password?</button>
              </div>
            </form>
            {error && <div className="error">{error}</div>}

          </div>
        </div>
      </div></>
      </body>
  );
}

export default LoginPage;
