import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../../styles/Inventory.css"; // Reuse Inventory CSS for consistency

export const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplier_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={24} title="Go Back" onClick={() => window.history.back()} />
      </div>

      <h2>Supplier Catalogue</h2>
      <div className="inventory-search">
        <input
          type="text"
          placeholder="Search by Supplier Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading suppliers...</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Contact Details</th>
              <th>Location</th>
              <th>Contract Terms</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.supplier_id}>
                <td>{supplier.supplier_name}</td>
                <td>{supplier.contact_details}</td>
                <td>{supplier.location}</td>
                <td>{supplier.contract_terms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add Supplier Button */}
      <div className="add-product-button-container">
        <button
          className="add-product-button"
          onClick={() => navigate("/procurement-manager/manage-suppliers/add-supplier")}
        >
          Add New Supplier
        </button>
      </div>
    </div>
  );
};

export default Suppliers;
