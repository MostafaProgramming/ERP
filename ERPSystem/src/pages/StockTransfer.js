import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../styles/PurchaseOrder.css";

export const StockTransfer = () => {
  const [stockTransfers, setStockTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const departmentId = localStorage.getItem("department_id");
  const locationId = localStorage.getItem("location_id");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchStockTransfers();
  }, []);

  const fetchStockTransfers = async () => {
    try {
      let response;
      if (departmentId == 4) {
        // Warehouse Manager fetches all relevant stock transfers
        response = await axios.get("http://localhost:5000/orders", {
          params: { order_type: "stock_transfer" },
        });
      } else if (departmentId == 5) {
        // Store Manager fetches stock transfers specific to their location
        response = await axios.get("http://localhost:5000/stock-transfers", {
          params: { order_type: "stock_transfer", location_id: locationId },
        });
      }
      setStockTransfers(response.data);
    } catch (error) {
      console.error("Error fetching stock transfers:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStockTransferStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}`, {
        status,
      });
      setStockTransfers((prevTransfers) =>
        prevTransfers.map((transfer) =>
          transfer.order_id === orderId
            ? {
                ...transfer,
                status,
                delivery_date:
                  status === "Completed" ? new Date().toISOString() : null,
              }
            : transfer
        )
      );
    } catch (error) {
      console.error("Error updating stock transfer status:", error);
    }
  };

  return (
    <div className="purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>

      <h2>Stock Transfer Management</h2>
      {loading ? (
        <p>Loading stock transfers...</p>
      ) : (
        <table className="purchase-order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Delivery Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockTransfers.map((transfer) => (
              <tr key={transfer.order_id}>
                <td>{transfer.order_id}</td>
                <td>{transfer.product_name || "N/A"}</td>
                <td>{transfer.quantity || 0}</td>
                <td>{transfer.destination_location_id}</td>
                <td>{transfer.status}</td>
                <td>
                  {transfer.delivery_date
                    ? new Date(transfer.delivery_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {/* Store Manager Actions */}
                  {role == "Store Manager" &&
                    transfer.status === "Pending" && (
                      <button
                        className="action-button approve"
                        onClick={() =>
                          updateStockTransferStatus(transfer.order_id, "Completed")
                        }
                      >
                        ✔️ Recieved
                      </button>
                    )}
                  {/* Warehouse Manager Actions */}
                  {role == "Warehouse Manager" &&
                    transfer.status === "Awaiting Approval" && (
                      <>
                        <button
                          className="action-button approve"
                          onClick={() =>
                            updateStockTransferStatus(transfer.order_id, "Pending")
                          }
                        >
                          ✔️ Approve
                        </button>
                        <button
                          className="action-button reject"
                          onClick={() =>
                            updateStockTransferStatus(transfer.order_id, "Cancelled")
                          }
                        >
                          ❌ Reject
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

export default StockTransfer;
