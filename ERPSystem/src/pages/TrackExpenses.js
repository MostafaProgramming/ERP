import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TrackExpenses.css";

const TrackExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
    employee: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/expenses");
      setExpenses(response.data);
      setFilteredExpenses(response.data); // Initialize filtered expenses
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));

    // Filter logic
    const updatedExpenses = expenses.filter((expense) => {
      const matchesDepartment =
        filters.department === "" ||
        expense.department_name
          ?.toLowerCase()
          .includes(filters.department.toLowerCase());
      const matchesEmployee =
        filters.employee === "" ||
        expense.employee_name
          ?.toLowerCase()
          .includes(filters.employee.toLowerCase());
      const matchesCategory =
        filters.category === "" ||
        expense.category
          ?.toLowerCase()
          .includes(filters.category.toLowerCase());
      const matchesDate =
        (!filters.startDate || new Date(expense.date_of_expense) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(expense.date_of_expense) <= new Date(filters.endDate));

      return matchesDepartment && matchesEmployee && matchesCategory && matchesDate;
    });

    setFilteredExpenses(updatedExpenses);
  };

  return (
    <div className="track-expenses">
      <header>
        <h1>Track Expenses</h1>
      </header>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="department"
          placeholder="Filter by Department"
          value={filters.department}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="employee"
          placeholder="Filter by Employee"
          value={filters.employee}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Filter by Category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
      </div>

      {/* Expenses Table */}
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Expense ID</th>
            <th>Amount</th>
            <th>Department</th>
            <th>Employee</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense.expense_id}>
              <td>{expense.expense_id}</td>
              <td>${Number(expense.amount).toFixed(2)}</td>
              <td>{expense.department_name || "N/A"}</td>
              <td>{expense.employee_name || "N/A"}</td>
              <td>{expense.category || "N/A"}</td>
              <td>
                {expense.date_of_expense
                  ? new Date(expense.date_of_expense).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{expense.description || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackExpenses;
