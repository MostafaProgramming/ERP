import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../../styles/CreatePurchaseOrder.css"; // Reusing consistent styles

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]); // Department options
  const [locations, setLocations] = useState([]); // Location options
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    salary: 0,
    department_id: "",
    location_id: "",
    hire_date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  useEffect(() => {
    fetchDepartments();
    fetchLocations();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/department");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/location");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/add-employee", formData);
      alert("Employee added successfully!");
      setFormData({
        name: "",
        email: "",
        role: "",
        salary: 0,
        department_id: "",
        location_id: "",
        hire_date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee.");
    }
  };

  return (
    <div className="create-purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>

      <h2>Add New Employee</h2>
      <form className="purchase-order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            min="0"
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
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department.department_id} value={department.department_id}>
                {department.department_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Location</label>
          <select
            name="location_id"
            value={formData.location_id}
            onChange={handleInputChange}
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {location.location_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Hire Date</label>
          <input
            type="date"
            name="hire_date"
            value={formData.hire_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
