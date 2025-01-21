import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPages.css";

const HRTeamLanding = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error(`Navigation error: ${error.message}`);
    }
  };

  return (
    <div className="landing-page">
      <button onClick={() => handleNavigation("/")}>Log Out</button>
      <header>
        <h1>Welcome, HR Team</h1>
      </header>
      <div className="action-cards">
        <div
          className="card"
          onClick={() => handleNavigation("/hr-team/managing-employees")}
        >
          <h3>Manage Employees</h3>
          <p>Oversee employee details and updates.</p>
        </div>
        <div
          className="card"
          onClick={() => handleNavigation("/hr-manager/add-employee")}
        >
          <h3>Add New Employees</h3>
          <p>Add New Employee To The Company</p>
        </div>
        <div
          className="card"
          onClick={() => handleNavigation("/hr-team/payrolls")}
        >
          <h3>Process Payroll</h3>
          <p>Handle payroll calculations and payments.</p>
        </div>
      </div>
    </div>
  );
};

export default HRTeamLanding;
