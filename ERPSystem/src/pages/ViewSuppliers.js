import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewSuppliers.css";

const ViewSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    supplier_name: "",
    contact_details: "",
    location: "",
    contract_terms: "",
  });

  // Fetch suppliers from the database when the component loads
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/suppliers");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Handle adding a new supplier
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/suppliers", newSupplier);
      setSuppliers([...suppliers, response.data]);
      setShowAddForm(false);
      setNewSupplier({
        supplier_name: "",
        contact_details: "",
        location: "",
        contract_terms: "",
      });
      alert("Supplier added successfully");
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert("An error occurred while adding the supplier.");
    }
  };

  // Handle editing a supplier
  const handleEditSupplier = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/suppliers/${editSupplier.supplier_id}`, editSupplier);
      setSuppliers(suppliers.map((supplier) =>
        supplier.supplier_id === editSupplier.supplier_id ? editSupplier : supplier
      ));
      setEditSupplier(null);
      alert("Supplier details updated successfully");
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("An error occurred while updating the supplier details.");
    }
  };

  // Handle negotiating contract terms
  const handleNegotiateContract = async (id) => {
    const updatedTerms = prompt("Enter new contract terms:");
    if (updatedTerms) {
      try {
        await axios.put(`http://localhost:5000/suppliers/${id}`, {
          contract_terms: updatedTerms,
        });
        setSuppliers(suppliers.map((supplier) =>
          supplier.supplier_id === id ? { ...supplier, contract_terms: updatedTerms } : supplier
        ));
        alert("Contract terms updated successfully");
      } catch (error) {
        console.error("Error negotiating contract terms:", error);
        alert("An error occurred while negotiating contract terms.");
      }
    }
  };

  // Handle deleting a supplier
  const handleDeleteSupplier = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(`http://localhost:5000/suppliers/${id}`);
        setSuppliers(suppliers.filter((supplier) => supplier.supplier_id !== id));
        alert("Supplier deleted successfully");
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert("An error occurred while deleting the supplier.");
      }
    }
  };

  return (
    <div className="view-suppliers">
      <h2>Supplier List</h2>
      {loading ? (
        <p>Loading supplier data...</p>
      ) : (
        <div className="supplier-table">
          <table>
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Contract Terms</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.supplier_id}>
                  <td>{supplier.supplier_name}</td>
                  <td>{supplier.contact_details}</td>
                  <td>{supplier.location}</td>
                  <td>{supplier.contract_terms}</td>
                  <td>
                    <button onClick={() => setEditSupplier(supplier)}>Edit</button>
                    <button onClick={() => handleNegotiateContract(supplier.supplier_id)}>Negotiate</button>
                    <button onClick={() => handleDeleteSupplier(supplier.supplier_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Button to show the form for adding a new supplier */}
      <button
        className="add-supplier-button"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Cancel" : "Add New Supplier"}
      </button>

      {/* Form to add a new supplier */}
      {showAddForm && (
        <div className="add-supplier-form">
          <h3>Add a New Supplier</h3>
          <form onSubmit={handleAddSupplier}>
            <div className="form-group">
              <label htmlFor="supplier_name">Supplier Name:</label>
              <input
                type="text"
                id="supplier_name"
                value={newSupplier.supplier_name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, supplier_name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact_details">Email:</label>
              <input
                type="email"
                id="contact_details"
                value={newSupplier.contact_details}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, contact_details: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                value={newSupplier.location}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, location: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contract_terms">Contract Terms:</label>
              <textarea
                id="contract_terms"
                value={newSupplier.contract_terms}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, contract_terms: e.target.value })
                }
              ></textarea>
            </div>
            <button type="submit" className="add-supplier-button">
              Add Supplier
            </button>
          </form>
        </div>
      )}

      {/* Form to edit a supplier */}
      {editSupplier && (
        <div className="edit-supplier-form">
          <h3>Edit Supplier Details</h3>
          <form onSubmit={handleEditSupplier}>
            <div className="form-group">
              <label htmlFor="supplier_name">Supplier Name:</label>
              <input
                type="text"
                id="supplier_name"
                value={editSupplier.supplier_name}
                onChange={(e) =>
                  setEditSupplier({ ...editSupplier, supplier_name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact_details">Email:</label>
              <input
                type="email"
                id="contact_details"
                value={editSupplier.contact_details}
                onChange={(e) =>
                  setEditSupplier({ ...editSupplier, contact_details: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                value={editSupplier.location}
                onChange={(e) =>
                  setEditSupplier({ ...editSupplier, location: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contract_terms">Contract Terms:</label>
              <textarea
                id="contract_terms"
                value={editSupplier.contract_terms}
                onChange={(e) =>
                  setEditSupplier({ ...editSupplier, contract_terms: e.target.value })
                }
              ></textarea>
            </div>
            <button type="submit" className="add-supplier-button">
              Update Supplier
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewSuppliers;
