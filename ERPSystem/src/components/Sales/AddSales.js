import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../../styles/CreatePurchaseOrder.css";

const AddSalesRecord = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    store_id: localStorage.getItem("location_id"), // Automatically set from local storage
    manager_id: localStorage.getItem("person_id"), // Automatically set from local storage
    product_id: "",
    quantity_sold: 1,
    date_of_sale: new Date().toISOString().split("T")[0],
    total_amount: 0,
    payment_method: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setFormData((prev) => ({ ...prev, product_id: productId }));

    const selectedProduct = products.find((product) => product.product_id === parseInt(productId));
    if (selectedProduct) {
      const price = selectedProduct.price || 0;
      setFormData((prev) => ({
        ...prev,
        total_amount: price * formData.quantity_sold,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "quantity_sold" && formData.product_id) {
      const selectedProduct = products.find(
        (product) => product.product_id === parseInt(formData.product_id)
      );
      if (selectedProduct) {
        setFormData((prev) => ({
          ...prev,
          total_amount: selectedProduct.price * parseInt(value || 0),
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/sales-records", formData);
      alert("Sales record added successfully.");
      setFormData({
        store_id: localStorage.getItem("location_id"), // Reset to local storage
        manager_id: localStorage.getItem("person_id"), // Reset to local storage
        product_id: "",
        quantity_sold: 1,
        date_of_sale: new Date().toISOString().split("T")[0],
        total_amount: 0,
        payment_method: "",
      });
    } catch (error) {
      console.error("Error adding sales record:", error);
      alert("Failed to add sales record.");
    }
  };

  return (
    <div className="create-purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>

      <h2>Add Sales Record</h2>
      <form className="purchase-order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product</label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleProductChange}
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.product_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity Sold</label>
          <input
            type="number"
            name="quantity_sold"
            value={formData.quantity_sold}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Sale</label>
          <input
            type="date"
            name="date_of_sale"
            value={formData.date_of_sale}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Total Amount</label>
          <input
            type="number"
            name="total_amount"
            value={formData.total_amount}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a payment method</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Add Sales Record
        </button>
      </form>
    </div>
  );
};

export default AddSalesRecord;
