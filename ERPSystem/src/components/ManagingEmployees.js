import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManagingEmployees.css";

export const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ site: "", role: "" });
  const [searchId, setSearchId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
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
  
      console.log("Filtered Person data fetched:", response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching person data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Function to delete a person
  const handleDeleteEmployee = async (personId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this person?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/person/${personId}`);
      alert("Person deleted successfully");
      // Refetch the list after deletion
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting person:", error);
      alert("An error occurred while trying to delete the person.");
    }
  };

  // Function to filter employees based on site and role
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
        <p>Loading person data...</p>
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
                  <th>Action</th>
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
                        <button onClick={() => setSelectedEmployee(employee)}>
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.person_id)}
                        >
                          Remove
                        </button>
                        <button
                          onClick={() =>
                            window.location.href = `/schedule/${employee.person_id}`
                          }
                        >
                          Manage Schedule
                        </button>
                        <button
                          onClick={() =>
                            window.location.href = `/payroll/${employee.person_id}`
                          }
                        >
                          Payroll
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedEmployee && (
            <div className="employee-details">
              <h3>Person Details</h3>
              <p>
                <strong>ID:</strong> {selectedEmployee.person_id}
              </p>
              <p>
                <strong>Name:</strong> {selectedEmployee.name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {selectedEmployee.dob || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {selectedEmployee.address || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {selectedEmployee.role}
              </p>
              <p>
                <strong>Location:</strong> {selectedEmployee.location || "N/A"}
              </p>
              <p>
                <strong>Hire Date:</strong> {selectedEmployee.hire_date}
              </p>
              <p>
                <strong>Salary:</strong> ${selectedEmployee.salary}
              </p>
              <button onClick={() => setSelectedEmployee(null)}>Close</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
