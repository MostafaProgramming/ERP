import React, { useState } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../styles/CreatePurchaseOrder.css"; // Reuse CreateOrder CSS

export const AddProduct = () => {
  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    price: "",
    stock_level: 0,
    reorder_level: 0,
    last_purchase_date: new Date().toISOString().split("T")[0],
    supplier_id: "",
    cost: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/products", formData);
      alert("Product added successfully!");
      setFormData({
        product_name: "",
        category: "",
        price: "",
        stock_level: 0,
        reorder_level: 0,
        last_purchase_date: new Date().toISOString().split("T")[0],
        supplier_id: "",
        cost: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="create-purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>

      <h2>Add New Product</h2>
      <form className="purchase-order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label>Stock Level</label>
          <input
            type="number"
            name="stock_level"
            value={formData.stock_level}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label>Reorder Level</label>
          <input
            type="number"
            name="reorder_level"
            value={formData.reorder_level}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label>Last Purchase Date</label>
          <input
            type="date"
            name="last_purchase_date"
            value={formData.last_purchase_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Supplier ID</label>
          <input
            type="number"
            name="supplier_id"
            value={formData.supplier_id}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Cost</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
