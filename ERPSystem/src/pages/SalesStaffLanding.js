import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPages.css";

const SalesStaffLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <button onClick={() => navigate("/")} className="logout-button">
        Log Out
      </button>
      <header>
        <h1>Welcome, Sales Staff</h1>
      </header>
      <div className="action-cards">
        <div
          className="card"
          onClick={() => navigate("/sales-staff/track-sales")}
        >
          <h3>Track Sales Data</h3>
          <p>Monitor sales data to ensure store performance.</p>
        </div>
        <div
          className="card"
          onClick={() => navigate("/sales-staff/analyse-sales")}
        >
          <h3>Analyse Sales Trends</h3>
          <p>Identify trends in product sales over time.</p>
        </div>
        <div
          className="card"
          onClick={() => navigate("/sales-staff/forecast-demand")}
        >
          <h3>Forecast Demand</h3>
          <p>Anticipate customer demand for better planning.</p>
        </div>
      </div>
    </div>
  );
};

export default SalesStaffLanding;
