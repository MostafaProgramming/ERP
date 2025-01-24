import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../../styles/CreatePurchaseOrder.css"; // Reusing consistent styles

const AddPerson = () => {
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Employee", // Default role
    salary: "",
    department_id: "",
    location_id: "",
    hire_date: new Date().toISOString().split("T")[0],
    performance_rating: "",
    absences: "",
    team_size: "",
    approval_limit: "",
    region: "",
    strategy_focus_area: "",
  });

  const [selectedRole, setSelectedRole] = useState("Employee"); // Track selected role

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

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    setFormData((prev) => ({
      ...prev,
      role, // Update role in formData
      performance_rating: "",
      absences: "",
      team_size: "",
      approval_limit: "",
      region: "",
      strategy_focus_area: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/add-person", formData);
      if (response.status === 201) {
        alert("Employee added successfully!");
        setFormData({
          name: "",
          email: "",
          role: "Employee",
          salary: "",
          department_id: "",
          location_id: "",
          hire_date: new Date().toISOString().split("T")[0],
          performance_rating: "",
          absences: "",
          team_size: "",
          approval_limit: "",
          region: "",
          strategy_focus_area: "",
        });
      } else {
        alert("Failed to add employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("An error occurred.");
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
        {/* Common Fields */}
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
          <select name="role" value={selectedRole} onChange={handleRoleChange} required>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Executive">Executive</option>
          </select>
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

        {/* Role-Specific Fields */}
        {selectedRole === "Employee" && (
          <>
            <div className="form-group">
              <label>Performance Rating</label>
              <input
                type="number"
                name="performance_rating"
                value={formData.performance_rating}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Absences</label>
              <input
                type="number"
                name="absences"
                value={formData.absences}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </>
        )}
        {selectedRole === "Manager" && (
          <>
            <div className="form-group">
              <label>Absences</label>
              <input
                type="number"
                name="absences"
                value={formData.absences}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Team Size</label>
              <input
                type="number"
                name="team_size"
                value={formData.team_size}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Approval Limit</label>
              <input
                type="number"
                name="approval_limit"
                value={formData.approval_limit}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </>
        )}
        {selectedRole === "Executive" && (
          <>
            <div className="form-group">
              <label>Region</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Strategic Focus</label>
              <input
                type="text"
                name="strategy_focus_area"
                value={formData.strategy_focus_area}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-button">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddPerson;
