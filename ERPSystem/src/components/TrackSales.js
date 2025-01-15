import React, { useState, useEffect } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../styles/TrackSales.css";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export const TrackSales = () => {
  // State to store sales data
  const [salesData, setSalesData] = useState([]);
  // State to manage loading indicator
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch sales data when the component mounts
  useEffect(() => {
    fetchSalesData();
  }, []);

  // Function to fetch sales data from backend API
  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sales-record");
      setSalesData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLoading(false);
    }
  };

  // Chart data configuration for rendering the line chart
  const chartData = {
    labels: salesData.map((sale) => new Date(sale.date_of_sale).toLocaleDateString()), // Labels for the x-axis (dates)
    datasets: [
      {
        label: "Total Amount Sold", // Label for the dataset
        data: salesData.map((sale) => sale.total_amount), // Data points for the y-axis (total amount sold)
        borderColor: "#007bff", // Line color
        backgroundColor: "rgba(0, 123, 255, 0.5)", // Fill color under the line
        fill: true, // Fill area under the line
      },
    ],
  };

  // Chart options to ensure responsiveness
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category", // Ensure the x-axis uses 'category' scale
        title: {
          display: true,
          text: "Date",
          color: "#003366",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Amount Sold",
          color: "#003366",
        },
      },
    },
  };

  return (
    <div className="sales-module">
      <h2>Track Sales Data</h2>
      {loading ? (
        // Display loading message while data is being fetched
        <p>Loading sales data...</p>
      ) : (
        <>
          {/* Render the sales chart once data is available */}
          <div className="sales-chart" style={{ height: "500px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
          {/* Render the sales data in a table format */}
          <div className="sales-data-table">
            <table>
              <thead>
                <tr>
                  <th>Sales ID</th>
                  <th>Date of Sale</th>
                  <th>Product ID</th>
                  <th>Store ID</th>
                  <th>Total Amount</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale) => (
                  <tr key={sale.sales_id}>
                    <td>{sale.sales_id}</td>
                    <td>{sale.date_of_sale}</td>
                    <td>{sale.product_id}</td>
                    <td>{sale.store_id}</td>
                    <td>{sale.total_amount}</td>
                    <td>{sale.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
