import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManagingEmployees.css";

export const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ site: "", role: "" });
  const [searchId, setSearchId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Toggle update form
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchLocations();
  }, []);

  const fetchEmployees = async () => {
    try {
      const departmentId = localStorage.getItem("department_id");
      const locationId = localStorage.getItem("location_id");

      let response;
      if (departmentId === "2") {
        // HR Manager: Fetch all employees
        response = await axios.get("http://localhost:5000/person");
      } else if (departmentId === "5") {
        // Store/Warehouse Manager: Fetch employees by location_id
        response = await axios.get("http://localhost:5000/person", {
          params: { location_id: locationId },
        });
      } else {
        // Other departments: Fetch employees by department_id
        response = await axios.get("http://localhost:5000/person", {
          params: { department_id: departmentId },
        });
      }

      console.log("Filtered Employee data fetched:", response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteEmployee = async (personId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this person?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/delete-person/${personId}`);
      alert("Person deleted successfully.");
      fetchEmployees(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting person:", error);
      alert("Failed to delete person.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/update-person/${selectedEmployee.person_id}`,
        selectedEmployee
      );
      alert("Employee updated successfully!");
      setShowUpdateForm(false);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee.");
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSite = filter.site
      ? employee.location?.toLowerCase().includes(filter.site.toLowerCase())
      : true;
    const matchesRole = filter.role
      ? employee.role?.toLowerCase().includes(filter.role.toLowerCase())
      : true;
    const matchesSearchId = searchId
      ? employee.person_id.toString().includes(searchId)
      : true;
    return matchesSite && matchesRole && matchesSearchId;
  });

  return (
    <div className="hr-module">
      <h2>Manage Employee Data</h2>
      {loading ? (
        <p>Loading employee data...</p>
      ) : (
        <>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by Person ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by Location"
              value={filter.site}
              onChange={(e) => setFilter({ ...filter, site: e.target.value })}
            />
            <input
              type="text"
              placeholder="Filter by Role"
              value={filter.role}
              onChange={(e) => setFilter({ ...filter, role: e.target.value })}
            />
          </div>

          <div className="employee-list">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.person_id}>
                    <td>{employee.person_id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.role}</td>
                    <td>{employee.location || "N/A"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowUpdateForm(true);
                          }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.person_id)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showUpdateForm && selectedEmployee && (
            <div className="update-form-container">
              <h3>Update Employee Details</h3>
              <form onSubmit={handleUpdateSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={selectedEmployee.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={selectedEmployee.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={selectedEmployee.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                {selectedEmployee.role === "Employee" && (
                  <>
                    <div className="form-group">
                      <label>Performance Rating</label>
                      <input
                        type="number"
                        name="performance_rating"
                        value={selectedEmployee.performance_rating || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Absences</label>
                      <input
                        type="number"
                        name="absences"
                        value={selectedEmployee.absences || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                {selectedEmployee.role === "Manager" && (
                  <>
                    <div className="form-group">
                      <label>Team Size</label>
                      <input
                        type="number"
                        name="team_size"
                        value={selectedEmployee.team_size || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Approval Limit</label>
                      <input
                        type="number"
                        name="approval_limit"
                        value={selectedEmployee.approval_limit || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                {selectedEmployee.role === "Executive" && (
                  <>
                    <div className="form-group">
                      <label>Region</label>
                      <input
                        type="text"
                        name="region"
                        value={selectedEmployee.region || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Strategic Focus Area</label>
                      <input
                        type="text"
                        name="strategy_focus_area"
                        value={selectedEmployee.strategy_focus_area || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};
