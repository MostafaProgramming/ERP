import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProcurementStaffLanding.css";

const ProcurementLanding = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data or perform any necessary data fetching for procurement landing page
    setLoading(false);
  }, []);

  return (
    <div className="procurement-landing">
      <header>
        <h1>Welcome, Procurement Team</h1>
      </header>

      {/* Action Cards */}
      <div className="action-cards">
        {/* Place Purchase Orders */}
        <div
          className="card"
          onClick={() => navigate("/procurement-staff/place-purchase-orders")}
        >
          <h3>Place Purchase Orders</h3>
          <p>Order New Engine Parts.</p>
        </div>

        {/* View Suppliers */}
        <div
          className="card"
          onClick={() => navigate("/procurement-manager/manage-suppliers")}
        >
          <h3>Manage Suppliers</h3>
          <p>Manage and Edit Supplier Information.</p>
        </div>

        {/* Track Inventory */}
        <div
          className="card"
          onClick={() => navigate("/procurement-manager/track-inventory")}
        >
          <h3>Track Inventory</h3>
          <p>Manage and Track Product Stock Levels</p>
        </div>

        {/* Track Delivery Schedules */}
        <div
          className="card"
          onClick={() => navigate("/procurement-manager/track-purchase-orders")}
        >
          <h3>Manage Purchase Orders</h3>
          <p>Manage and Track Current Purchase Orders.</p>
        </div>
        {/* Manage Product Catalogue */}
        <div
          className="card"
          onClick={() => navigate("/procurement-manager/manage-products")}
        >
          <h3>Manage Products</h3>
          <p>Add products or Edit Existting Products.</p>
        </div>
      </div>

      {loading && <p>Loading procurement data...</p>}
    </div>
  );
};

export default ProcurementLanding;
