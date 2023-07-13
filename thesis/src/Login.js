import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  let navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // put your login logic here

    // after logging in, navigate to the main page
    navigate("/");
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
