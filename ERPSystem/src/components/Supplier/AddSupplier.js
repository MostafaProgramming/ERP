import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import "../../styles/CreatePurchaseOrder.css";

export const AddSupplier = () => {
  const [formData, setFormData] = useState({
    supplier_name: "",
    contact_details: "",
    location: "",
    contract_terms: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/suppliers", formData);
      alert("Supplier Added Successfully!");
      setFormData({
        supplier_name: "",
        contact_details: "",
        location: "",
        contract_terms: "",
      });
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert("Failed to add supplier.");
    }
  };

  return (
    <div className="create-purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={24} title="Go Back" onClick={() => window.history.back()} />
      </div>

      <h2>Add New Supplier</h2>
      <form className="purchase-order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Supplier Name</label>
          <input
            type="text"
            name="supplier_name"
            value={formData.supplier_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Details</label>
          <input
            type="text"
            name="contact_details"
            value={formData.contact_details}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contract Terms</label>
          <input
            type="text"
            name="contract_terms"
            value={formData.contract_terms}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Supplier
        </button>
      </form>
    </div>
  );
};

export default AddSupplier;
