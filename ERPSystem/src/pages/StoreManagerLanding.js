import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPages.css"; // Use the shared LandingPage.css

const StoreManagerLanding = () => {
  const navigate = useNavigate();

  const handleNavigation = (action) => {
    switch (action) {
      case "inventory":
        navigate("/store-manager/track-inventory"); // Redirect to Inventory Page
        break;
      case "sales":
        navigate("/sales"); // Redirect to Sales Analysis Page
        break;
      case "employees":
        navigate("/store-manager/managing-employees"); // Redirect to Employee Scheduling Page
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    navigate("/"); // Redirect to Login Page
  };

  return (
    <div className="landing-page">
      <header>
        <h1>Welcome, Store Manager</h1>
      </header>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="card" onClick={() => handleNavigation("inventory")}>
          <h3>Track Inventory</h3>
          <p>Monitor stock levels and reorder products.</p>
        </div>
        <div className="card" onClick={() => handleNavigation("sales")}>
          <h3>Analyse Sales</h3>
          <p>Review store performance and sales trends.</p>
        </div>
        <div className="card" onClick={() => handleNavigation("employees")}>
          <h3>Manage Store Employees</h3>
          <p>View Employees and Track Work Schedules</p>
        </div>
      </div>

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default StoreManagerLanding;
