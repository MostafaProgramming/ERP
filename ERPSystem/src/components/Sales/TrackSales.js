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
import { useNavigate } from "react-router-dom"; // For navigation
import "../../styles/TrackSales.css";

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

export const TrackSales = ({ departmentId }) => {
  const [salesData, setSalesData] = useState([]); // Sales data state
  const [loading, setLoading] = useState(true); // Loading state
  const [search, setSearch] = useState(""); // Search input state
  const [filteredSales, setFilteredSales] = useState([]); // Filtered sales data
  const navigate = useNavigate(); // Navigation hook

  const storedDepartmentId = localStorage.getItem("department_id");
  const storedLocationId = localStorage.getItem("location_id");
  const storedPersonId = localStorage.getItem("person_id");

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    // Filter sales data dynamically based on search input
    const filtered = salesData.filter(
      (sale) =>
        sale.product_id.toString().includes(search) ||
        sale.store_id.toString().includes(search) ||
        new Date(sale.date_of_sale)
          .toLocaleDateString()
          .toLowerCase()
          .includes(search.toLowerCase())
    );
    setFilteredSales(filtered);
  }, [search, salesData]);

  const fetchSalesData = async () => {
    try {
      let response;
      if (storedDepartmentId === "1") {
        // Sales Manager: Fetch all Sales
        response = await axios.get("http://localhost:5000/sales-record");
      } else {
        // Store/Warehouse Manager: Fetch sales by location_id
        response = await axios.get("http://localhost:5000/sales-by-store", {
          params: { location_id: storedLocationId },
        });
      }
      setSalesData(response.data);
      setFilteredSales(response.data); // Initialize filtered data with all sales
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLoading(false);
    }
  };

  const chartData = {
    labels: filteredSales.map((sale) =>
      new Date(sale.date_of_sale).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Total Amount Sold",
        data: filteredSales.map((sale) => sale.total_amount),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
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
      <div className="inventory-search">
        <input
          type="text"
          placeholder="Search by Product ID, Store ID, or Date"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading sales data...</p>
      ) : (
        <>
          <div className="sales-chart" style={{ height: "500px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
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
                {filteredSales.map((sale) => (
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
            {storedDepartmentId === "5" && (
              <div className="add-sales-button-container">
                <button
                  className="add-sales-button"
                  onClick={() =>
                    navigate("/add-sales-record", {
                      state: {
                        store_id: storedLocationId,
                        manager_id: storedPersonId,
                      },
                    })
                  }
                >
                  Add New Sales Record
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
