import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "../../styles/Inventory.css";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/budgets");
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const filteredBudgets = budgets.filter((budget) =>
    budget.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-module">
      <div className="inventory-header">
        <h2>Budget Catalogue</h2>
        <input
          type="text"
          placeholder="Search by Description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Budget ID</th>
            <th>Department ID</th>
            <th>Allocated Amount</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Description</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
            {filteredBudgets.map((budget) => (
                <tr key={budget.budget_id}>
                <td>{budget.budget_id}</td>
                <td>{budget.department_id}</td>
                <td>
                    {budget.allocated_amount}
                
                </td>
                <td>
                    {budget.start_date
                    ? new Date(budget.start_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                    {budget.end_date
                    ? new Date(budget.end_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{budget.description || "N/A"}</td>
                <td>{budget.category || "N/A"}</td>
                </tr>
            ))}
        </tbody>
      </table>
      <div className="add-button-container">
        <button
          className="add-button"
          onClick={() => navigate("/finance-manager/add-department-budget")}
        >
          Add New Budget
        </button>
      </div>
    </div>
  );
};

export default Budget;
