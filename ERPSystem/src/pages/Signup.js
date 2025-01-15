import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    // Simulate sending user details to the admin
    alert(`Account request sent for: ${email}, Role: ${role}`);
    navigate("/"); // Go back to login after signup
  };

  return (
    <div className="signup-container">
      <img
        src="https://www.carlogos.org/logo/Rolls-Royce-symbol-2048x2048.png"
        alt="Rolls-Royce Logo"
        className="rr-logo"
      />
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="store_manager">Store Manager</option>
          <option value="inventory_manager">Inventory Manager</option>
          <option value="sales_rep">Sales Representative</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => navigate("/")}>Back to Login</button>
    </div>
  );
};

export default Signup;
