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
        response = await axios.get("http://localhost:5000/purchase-orders");
      } else if (departmentId == 5) {
        response = await axios.get("http://localhost:5000/purchase-orders", {
          params: { location_id: locationId },
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
      await axios.put(`http://localhost:5000/purchase-orders/${orderId}`, {
        status,
      });
      setPurchaseOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.purchase_order_id === orderId
            ? {
                ...order,
                order_status: status,
                delivery_date: status === "Completed" ? new Date().toLocaleDateString() : "N/A",
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
              <tr key={order.purchase_order_id}>
                <td>{order.purchase_order_id}</td>
                <td>{order.product_name || "N/A"}</td>
                <td>{order.quantity || 0}</td>
                <td>
                  {order.total_amount
                    ? Number(order.total_amount).toFixed(2)
                    : "N/A"}
                </td>
                <td>{order.order_status}</td>
                <td>
                  {order.delivery_date
                    ? new Date(order.delivery_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {/* Procurement Manager Actions */}
                  {departmentId == 4 && order.order_status === "Awaiting Approval" && (
                    <>
                      <button
                        className="action-button approve"
                        onClick={() =>
                          updatePurchaseOrderStatus(
                            order.purchase_order_id,
                            "Pending"
                          )
                        }
                      >
                        ✔️
                      </button>
                      <button
                        className="action-button reject"
                        onClick={() =>
                          updatePurchaseOrderStatus(
                            order.purchase_order_id,
                            "Cancelled"
                          )
                        }
                      >
                        ❌
                      </button>
                    </>
                  )}
                  {/* Warehouse Manager Actions */}
                  {departmentId == 5 &&
                    (order.order_status === "Pending" ||
                      order.order_status === "Late") && (
                      <>
                        <button
                          className="action-button approve"
                          onClick={() =>
                            updatePurchaseOrderStatus(
                              order.purchase_order_id,
                              "Completed"
                            )
                          }
                        >
                          ✔️
                        </button>
                        <button
                          className="action-button reject"
                          onClick={() =>
                            updatePurchaseOrderStatus(
                              order.purchase_order_id,
                              "Late"
                            )
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
