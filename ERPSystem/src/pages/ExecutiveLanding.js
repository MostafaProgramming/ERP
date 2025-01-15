import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPages.css";

const ExecutiveLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <button onClick={() => navigate("/")}>Log Out</button>
      <header>
        <h1>Welcome, Executive</h1>
      </header>
      <div className="action-cards">
        <div className="card" onClick={() => navigate("/company-reports")}>
          <h3>View All Company Reports</h3>
          <p>Analyze reports and gain business insights.</p>
        </div>
        <div className="card" onClick={() => navigate("/business-aims")}>
          <h3>Set Business Aims</h3>
          <p>Define strategic goals for the organization.</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveLanding;
