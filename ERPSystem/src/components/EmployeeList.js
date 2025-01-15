// EmployeeList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Request the backend for employees data
        const response = await axios.get('http://localhost:5000/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <h1>Employee List</h1>
      <ul>
        {employees.map((employee) => (
          <li key={employee.employee_id}>
            {employee.name} - {employee.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeList;
