import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProcurementStaffLanding.css"; // Using the same CSS as ProcurementLanding

const FinanceLanding = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data or perform any necessary data fetching for the finance landing page
    setLoading(false);
  }, []);

  return (
    <div className="procurement-landing">
      <header>
        <h1>Welcome, Finance Team</h1>
      </header>

      {/* Action Cards */}
      <div className="action-cards">
        {/* Track Expenses */}
        <div className="card" onClick={() => navigate("/finance-manager/track-expenses")}>
          <h3>Track Expenses</h3>
          <p>View and Analyze Departmental Expenses.</p>
        </div>

        {/* Manage Expenses */}
        <div
          className="card"
          onClick={() => navigate("/finance/manage-expenses")}
        >
          <h3>Manage Expenses</h3>
          <p>Add, Edit, or Delete Expense Records.</p>
        </div>

        {/* Manage Budgets */}
        <div
          className="card"
          onClick={() => navigate("/finance/manage-budgets")}
        >
          <h3>Manage Budgets</h3>
          <p>Allocate, Monitor, and Adjust Department Budgets.</p>
        </div>

        {/* Financial Reports */}
        <div
          className="card"
          onClick={() => navigate("/finance/financial-reports")}
        >
          <h3>Financial Reports</h3>
          <p>Generate and Analyze Financial Reports.</p>
        </div>
      </div>

      {loading && <p>Loading finance data...</p>}
    </div>
  );
};

export default FinanceLanding;
