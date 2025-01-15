import React, { useState, useEffect } from "react";
import "../styles/TrackDeliverySchedules.css";

const TrackDeliverySchedules = () => {
  // State to store purchase order data
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  // State to manage loading indicator
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch purchase orders data when the component mounts
  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  // Function to fetch purchase orders from the backend
  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/purchase-orders");
      const data = await response.json();
      setPurchaseOrders(data); // Update state with fetched data
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      setLoading(false);
    }
  };

  return (
    <div className="procurement-module">
      <h2>Track Delivery Schedules</h2>
      {loading ? (
        // Display loading message while data is being fetched
        <p>Loading purchase order data...</p>
      ) : (
        // Render the purchase orders data in a table format
        <div className="purchase-order-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Total Amount</th>
                <th>Order Status</th>
                <th>Supplier ID</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((order) => (
                <tr key={order.purchase_order_id}>
                  <td>{order.purchase_order_id}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>{new Date(order.delivery_date).toLocaleDateString()}</td>
                  <td>${order.total_amount}</td>
                  <td>{order.order_status}</td>
                  <td>{order.supplier_id ? order.supplier_id : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrackDeliverySchedules;
