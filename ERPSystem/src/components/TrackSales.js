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

export const TrackSales = ({ departmentId }) => {
  // State to store sales data
  const [salesData, setSalesData] = useState([]);
  // State to manage loading indicator
  const [loading, setLoading] = useState(true);
  // State to store available locations for filtering
  const [locations, setLocations] = useState([]);
  // State to track selected location for filtering
  const [selectedLocation, setSelectedLocation] = useState("");

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchSalesData();
    fetchLocations();
  }, []);

  // Function to fetch sales data from backend API
  const fetchSalesData = async (locationId = null) => {
    try {
      const departmentId = localStorage.getItem("department_id");
      const locationId = localStorage.getItem("location_id");
      let response;
  
      if (departmentId === "1") {
        // Sales Manager: Fetch all Sales
        response = await axios.get("http://localhost:5000/sales-record");
      } else if (departmentId !== "1") {
        // Store/Warehouse Manager: Fetch employees by location_id
        response = await axios.get("http://localhost:5000/sales-by-store", {
          params: { location_id: locationId },
        });
      } 
      setLoading(true);
      setSalesData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLoading(false);
    }
  };

  // Function to fetch locations for the filter
  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Handle change in location filter
  const handleLocationChange = (e) => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);
    fetchSalesData(locationId);
  };

  // Chart data configuration for rendering the line chart
  const chartData = {
    labels: salesData.map((sale) =>
      new Date(sale.date_of_sale).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Total Amount Sold",
        data: salesData.map((sale) => sale.total_amount),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        fill: true,
      },
    ],
  };

  // Chart options to ensure responsiveness
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
      {departmentId !== 1 && (
        <div className="filter-container">
          <label htmlFor="location-filter">Filter by Location:</label>
          <select
            id="location-filter"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {location.location_name}
              </option>
            ))}
          </select>
        </div>
      )}
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
