import React, { useState } from "react";
import axios from "axios";
import "../../styles/Report.css";

export const FinancialReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const generateReport = async () => {
    try {
      setError("");
      const response = await axios.get("http://localhost:5000/financial-reports", {
        params: { start_date: startDate, end_date: endDate },
      });
      setReport(response.data);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate financial report.");
    }
  };

  return (
    <div className="report-module">
      <h2>Financial Reports</h2>
      <div className="report-filters">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={generateReport}>Generate Report</button>
      </div>

      {error && <p className="error">{error}</p>}

      {report && (
        <div className="report-results">
          <h3>Profit & Loss Report</h3>
          <table>
            <tbody>
              <tr>
                <td>Total Sales:</td>
                <td>${report.total_sales}</td>
              </tr>
              <tr>
                <td>Total Expenses:</td>
                <td>${report.total_expenses}</td>
              </tr>
              <tr>
                <td>Total Salaries:</td>
                <td>${report.total_salaries}</td>
              </tr>
              <tr>
                <td>Total Purchase Orders:</td>
                <td>${report.total_purchase_orders}</td>
              </tr>
              <tr>
                <td>Profit/Loss:</td>
                <td
                  style={{
                    color: report.profit >= 0 ? "green" : "red",
                  }}
                >
                  ${report.profit}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FinancialReports;
