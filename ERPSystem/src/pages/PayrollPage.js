import React, { useState } from "react";
import "../styles/PayrollPage.css";

const PayrollPage = () => {
  // Mock data for employees
  const [employees, setEmployees] = useState([
    {
      lastName: "Adams",
      firstName: "Matthew",
      hireDate: "15.08.2015",
      address: "Abbey Road 5",
      postcode: "NW8",
      city: "London",
      department: "Finance & Compliance",
      salary: "£45,000",
      absences: 2,
    },
    {
      lastName: "Allen",
      firstName: "Nancy",
      hireDate: "01.02.2020",
      address: "Stanley Road 25",
      postcode: "M1 1AH",
      city: "Manchester",
      department: "IT",
      salary: "£50,000",
      absences: 1,
    },
    // Add more employees as needed
  ]);

  // Function to handle payroll approval
  const handleApprovePayroll = () => {
    alert("Payroll Approved!");
  };

  return (
    <div className="payroll-page">
      <h1>Payroll</h1>
      <div className="payroll-header">
        <h2>May 2024</h2>
        <div className="action-buttons">
          <button onClick={handleApprovePayroll} className="approve-button">
            Approve Payroll
          </button>
          <button className="export-button">Generate Export</button>
        </div>
      </div>
      <table className="payroll-table">
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Hire Date</th>
            <th>Address</th>
            <th>Postcode</th>
            <th>City</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Absences</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.lastName}</td>
              <td>{employee.firstName}</td>
              <td>{employee.hireDate}</td>
              <td>{employee.address}</td>
              <td>{employee.postcode}</td>
              <td>{employee.city}</td>
              <td>{employee.department}</td>
              <td>{employee.salary}</td>
              <td>{employee.absences}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollPage;
