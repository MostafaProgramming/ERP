import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPages.css";

const WarehouseManagerLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <button onClick={() => navigate("/")} className="logout-button">
        Log Out
      </button>
      <header>
        <h1>Welcome, Warehouse Manager</h1>
      </header>
      <div className="action-cards">
        <div className="card" onClick={() => navigate("/warehouse-manager/receive-purchase-orders")}>
          <h3>Receive Shipments</h3>
          <p>Record incoming shipments from suppliers.</p>
        </div>
        <div className="card" onClick={() => navigate("/warehouse-manager/track-inventory")}>
          <h3>Track Stock Movement</h3>
          <p>Monitor stock movement within the warehouse.</p>
        </div>
        <div className="card" onClick={() => navigate("/coordinate-stores")}>
          <h3>Coordinate with Stores</h3>
          <p>Coordinate stock replenishment with stores.</p>
        </div>
        <div className="card" onClick={() => navigate("/warehouse-manager/place-purchase-orders")}>
          <h3>Create Purchase Orders</h3>
          <p>Place New Purchase Order Requests.</p>
        </div>
        <div
          className="card"
          onClick={() => navigate("/store-manager/schedule")}
        >
          <h3>Manage Employee Schedules</h3>
          <p>Assign and track employee shifts effectively.</p>
        </div>
      </div>
    </div>
  );
};

export default WarehouseManagerLanding;
