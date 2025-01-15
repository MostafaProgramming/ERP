import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { email, role, person_id, department_id, location_id } = response.data.user;

        console.log("Login Response:", { email, role, person_id, department_id, location_id });

        // Store in localStorage
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        localStorage.setItem("person_id", person_id);
        localStorage.setItem("department_id", department_id);
        localStorage.setItem("location_id", location_id);
        

        // Navigate to the respective role's landing page
        switch (role) {
          case "Store Manager":
            navigate("/store-manager");
            break;
          case "Procurement Manager":
            navigate("/procurement-manager");
            break;
          case "Warehouse Manager":
            navigate("/warehouse-manager");
            break;
          case "Sales Manager":
            navigate("/sales-manager");
            break;
          case "HR Manager":
            navigate("/hr-manager");
            break;
          case "Finance Manager":
            navigate("/finance-manager");
            break;
          case "Executive":
            navigate("/executive");
            break;
          default:
            alert("Role not recognized");
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while trying to log in.");
    }
  };

  return (
    <div className="login-container">
      <img
        src="https://www.carlogos.org/logo/Rolls-Royce-symbol-2048x2048.png"
        alt="Rolls-Royce Logo"
        className="rr-logo"
      />
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
