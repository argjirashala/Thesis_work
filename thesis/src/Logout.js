import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  let navigate = useNavigate();

  useEffect(() => {
    // This simulates the logout process.
    // In a real-world application, you might call an API endpoint to invalidate the user's session or token.
    setTimeout(() => {
      // Redirect to the login page or home page after logout
      navigate("/");
    }, 2000);
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
      {/* You can add other content or a loader here if needed */}
    </div>
  );
}

export default Logout;
