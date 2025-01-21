import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../../styles/CreatePurchaseOrder.css"; // Reuse consistent styles

const AddExpense = () => {
  const [departments, setDepartments] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    department_id: "",
    budget_id: "",
    category: "",
    date_of_expense: new Date().toISOString().split("T")[0],
    description: "",
    person_id: localStorage.getItem("person_id"), // Auto-set from local storage
  });

  useEffect(() => {
    fetchDepartments();
    fetchBudgets();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/budgets");
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/expenses", formData);
      alert("Expense added successfully.");
      setFormData({
        amount: "",
        department_id: "",
        budget_id: "",
        category: "",
        date_of_expense: new Date().toISOString().split("T")[0],
        description: "",
        person_id: localStorage.getItem("person_id"),
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense.");
    }
  };

  return (
    <div className="create-purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>

      <h2>Add New Expense</h2>
      <form className="purchase-order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a Department</option>
            {departments.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Budget</label>
          <select
            name="budget_id"
            value={formData.budget_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a Budget</option>
            {budgets.map((budget) => (
              <option key={budget.budget_id} value={budget.budget_id}>
                {budget.budget_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Expense</label>
          <input
            type="date"
            name="date_of_expense"
            value={formData.date_of_expense}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
