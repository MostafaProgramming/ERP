import React, { useState, useEffect } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../styles/AnalyseSales.css";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AnalyseSales = () => {
  const [salesTrends, setSalesTrends] = useState([]); // Monthly sales trends
  const [productTrends, setProductTrends] = useState([]); // Quantity sold trends
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesTrends();
    fetchProductTrends();
  }, []);

  // Fetch monthly sales trends
  const fetchSalesTrends = async () => {
    try {
      const response = await fetch("http://localhost:5000/sales-trends"); // Backend endpoint for monthly sales trends
      const data = await response.json();
      setSalesTrends(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales trends:", error);
      setLoading(false);
    }
  };

  // Fetch product quantity sold trends
  const fetchProductTrends = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/sales-trends-by-product"
      ); // Backend endpoint for product trends
      const data = await response.json();
      setProductTrends(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product trends:", error);
      setLoading(false);
    }
  };

  // Chart data for monthly sales trends
  const salesChartData = {
    labels: salesTrends.map((trend) => trend.month),
    datasets: [
      {
        label: "Monthly Sales ($)",
        data: salesTrends.map((trend) => trend.total_sales),
        backgroundColor: "#28a745",
        borderColor: "#1e7e34",
        borderWidth: 1,
      },
    ],
  };

  // Chart data for product quantity trends
  const productChartData = {
    labels: productTrends.map((product) => product.product_name),
    datasets: [
      {
        label: "Quantity Sold",
        data: productTrends.map((product) => product.total_quantity),
        backgroundColor: "#007bff",
        borderColor: "#0056b3",
        borderWidth: 1,
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
          text: "Category",
          color: "#003366",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
          color: "#003366",
        },
      },
    },
  };

  return (
    <div className="sales-module">
      <h2>Analyse Sales Trends</h2>
      {loading ? (
        <p>Loading sales trends...</p>
      ) : (
        <>
          {/* Monthly Sales Chart */}
          <div className="sales-chart" style={{ height: "500px" }}>
            <h3>Monthly Sales</h3>
            <Bar data={salesChartData} options={chartOptions} />
          </div>

          {/* Product Quantity Sold Chart */}
          <div
            className="sales-chart"
            style={{ height: "500px", marginTop: "50px" }}
          >
            <h3>Product Quantity Sold</h3>
            <Bar data={productChartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
};
