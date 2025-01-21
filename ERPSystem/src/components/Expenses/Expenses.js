import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../../styles/Inventory.css"; // Reuse consistent styles

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(search.toLowerCase()) ||
      expense.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={24} title="Go Back" onClick={() => window.history.back()} />
      </div>

      <h2>Expense Records</h2>
      <div className="inventory-search">
        <input
          type="text"
          placeholder="Search by Category or Description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Expense ID</th>
              <th>Amount</th>
              <th>Department</th>
              <th>Budget ID</th>
              <th>Category</th>
              <th>Date</th>
              <th>Description</th>
              <th>Person ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.expense_id}>
                <td>{expense.expense_id}</td>
                <td>{expense.amount}</td>
                <td>{expense.department_id}</td>
                <td>{expense.budget_id}</td>
                <td>{expense.category}</td>
                <td>{expense.date_of_expense}</td>
                <td>{expense.description}</td>
                <td>{expense.person_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
