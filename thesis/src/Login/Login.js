import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function RoleSelectModal({ onSelect }) {
  return (
    <div className="modal">
      <p>Please select your role:</p>
      <button onClick={() => onSelect("doctor")}>Doctor</button>
      <button onClick={() => onSelect("patient")}>Patient</button>
    </div>
  );
}

function RegSelectModal({ onSelect }) {
  return (
    <div style={{ backgroundColor: "#0A2558" }}>
      <p>&nbsp;&nbsp;If you haven't register yet please do so:</p>
      &nbsp;&nbsp;
      <button onClick={() => onSelect("doctor")}>Register as Doctor</button>
      &nbsp;&nbsp;&nbsp;
      <button onClick={() => onSelect("patient")}>Register as Patient</button>
    </div>
  );
}

function LoginPage() {
  const auth = getAuth();
  const db = getFirestore();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
    if (role === "doctor") {
      navigate(`/indexDoctor/${userId}`);
    } else {
      navigate(`/indexPatient/${userId}`);
    }
  };

  const handleRegSelect = (role) => {
    setRegSelectModal(false);
    if (role === "doctor") {
      navigate(`/registerdoc`);
    } else {
      navigate(`/register`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setUserId(userCredential.user.uid);

      const doctorsQuery = query(
        collection(db, "doctors"),
        where("email", "==", formData.email)
      );
      const patientsQuery = query(
        collection(db, "patients"),
        where("email", "==", formData.email)
      );

      const [doctorsSnapshot, patientsSnapshot] = await Promise.all([
        getDocs(doctorsQuery),
        getDocs(patientsQuery),
      ]);

      const isDoctor = !doctorsSnapshot.empty;
      const isPatient = !patientsSnapshot.empty;
      if (userCredential.user.email === "admin@admin.com") {
        navigate("/indexAdmin");
      }
      if (isDoctor && isPatient) {
        setShowRoleSelectModal(true);
      } else if (isDoctor) {
        navigate(`/indexDoctor/${userCredential.user.uid}`);
      } else if (isPatient) {
        navigate(`/indexPatient/${userCredential.user.uid}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setRegSelectModal(true);
      alert("Invalid email or password!");
    }
  };

  const handleForgotPassword = async () => {
    const email = formData.email;

    if (!email) {
      alert("Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError("Error sending password reset email. Please try again.");
    }
  };

  return (
    <body>
      <>
        <div>
          {showRoleSelectModal && (
            <RoleSelectModal onSelect={handleRoleSelect} />
          )}
          {showRegSelectModal && <RegSelectModal onSelect={handleRegSelect} />}
        </div>
        <div className="login-wrapper">
          <div className="parent-container">
            <div className="login-form">
              <form className="mainForm" onSubmit={handleSubmit}>
                <div className="login forms form-style">
                  <br />
                  <br></br>

                  <label>
                    <p style={{ color: "black" }}>Email:</p>
                    <input
                      type="text"
                      name="email"
                      onChange={handleChange}
                      required
                      className="input input-field"
                    />
                  </label>
                  <label>
                    <p style={{ color: "black" }}>Password:</p>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      required
                      className="input input-field"
                    />
                  </label>
                  <br />
                  <button type="submit" className="input submit">
                    Login
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="forgot-password"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
              {error && <div className="error">{error}</div>}
            </div>
          </div>
        </div>
      </>
    </body>
  );
}

export default LoginPage;
