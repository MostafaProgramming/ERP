import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../styles/PurchaseOrder.css";

export const PurchaseOrder = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const departmentId = localStorage.getItem("department_id");
  const locationId = localStorage.getItem("location_id");

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      let response;
      if (departmentId == 4) {
        response = await axios.get("http://localhost:5000/orders", {
          params: { order_type: "purchase_order" },
        });
      } else if (departmentId == 5) {
        response = await axios.get("http://localhost:5000/orders", {
          params: { order_type: "purchase_order", location_id: locationId },
        });
      }
      setPurchaseOrders(response.data);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}`, {
        status,
      });
      setPurchaseOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? {
                ...order,
                status,
                delivery_date:
                  status === "Completed" ? new Date().toISOString() : null,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating purchase order status:", error);
    }
  };

  return (
    <div className="purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>

      <h2>Purchase Order Management</h2>
      {loading ? (
        <p>Loading purchase orders...</p>
      ) : (
        <table className="purchase-order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Delivery Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.product_name || "N/A"}</td>
                <td>{order.quantity || 0}</td>
                <td>
                  {order.total_amount
                    ? Number(order.total_amount).toFixed(2)
                    : "N/A"}
                </td>
                <td>{order.status}</td>
                <td>
                  {order.delivery_date
                    ? new Date(order.delivery_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {/* Procurement Manager Actions */}
                  {departmentId == 4 && order.status === "Awaiting Approval" && (
                    <>
                      <button
                        className="action-button approve"
                        onClick={() =>
                          updatePurchaseOrderStatus(order.order_id, "Pending")
                        }
                      >
                        ✔️ Approve
                      </button>
                      <button
                        className="action-button reject"
                        onClick={() =>
                          updatePurchaseOrderStatus(order.order_id, "Cancelled")
                        }
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {/* Warehouse Manager Actions */}
                  {departmentId == 5 &&
                    (order.status === "Pending" || order.status === "Late") && (
                      <>
                        <button
                          className="action-button approve"
                          onClick={() =>
                            updatePurchaseOrderStatus(order.order_id, "Completed")
                          }
                        >
                          ✔️ Recieved
                        </button>
                        <button
                          className="action-button reject"
                          onClick={() =>
                            updatePurchaseOrderStatus(order.order_id, "Late")
                          }
                        >
                          ❌ 
                        </button>
                      </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchaseOrder;
