import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // Import home icon
import "../styles/Inventory.css";

export const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const departmentId = localStorage.getItem("department_id");
  const locationId = localStorage.getItem("location_id");

  const navigate = useNavigate(); // Use navigate for navigation

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      let response;
      if (departmentId == 4) {
        // Procurement Manager: Fetch all inventory
        response = await axios.get("http://localhost:5000/inventory");
      } else if (departmentId == 5) {
        // Store/Warehouse Manager: Fetch inventory for specific location
        response = await axios.get("http://localhost:5000/inventory", {
          params: { location_id: locationId },
        });
      }
      setInventoryData(response.data);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter inventory based on search input
  const filteredInventory = inventoryData.filter((item) => {
    const productName = item.product_name || ""; // Ensure no undefined values
    return productName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="inventory-module">
      {/* Home Icon for Navigation */}
      <div className="home-icon" onClick={() => navigate(-1)}>
        <FaHome size={24} title="Go Back" />
      </div>

      <h2>Inventory Management</h2>
      <div className="inventory-search">
        <input
          type="text"
          placeholder="Search by Product Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading inventory data...</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Last Updated</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.inventory_id}>
                <td>{item.product_name || "N/A"}</td>
                <td>{item.category || "N/A"}</td>
                <td>{item.quantity || 0}</td>
                <td>
                  {item.last_updated
                    ? new Date(item.last_updated).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{item.location_name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventory;
