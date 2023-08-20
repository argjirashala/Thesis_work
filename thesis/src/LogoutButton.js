import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
    let navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");  // Redirect to Logout page
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
