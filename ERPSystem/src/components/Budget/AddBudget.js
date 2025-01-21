import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../../styles/CreatePurchaseOrder.css";

const AddBudget = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    department_id: "",
    allocated_amount: "",
    start_date: "",
    end_date: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/department");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/budgets", formData);
      alert("Budget added successfully.");
      setFormData({
        department_id: "",
        allocated_amount: "",
        start_date: "",
        end_date: "",
        description: "",
        category: "",
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      alert("Failed to add budget.");
    }
  };

  return (
    <div className="create-purchase-order-module">
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>
      <h2>Add New Budget</h2>
      <form className="purchase-order-form" onSubmit={handleSubmit}>
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
          <label>Allocated Amount</label>
          <input
            type="number"
            name="allocated_amount"
            value={formData.allocated_amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
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
          ></textarea>
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
        <button type="submit" className="submit-button">
          Add Budget
        </button>
      </form>
    </div>
  );
};

export default AddBudget;
