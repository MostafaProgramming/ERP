import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../styles/CreatePurchaseOrder.css";

export const CreatePurchaseOrder = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productCost, setProductCost] = useState(0); // To store the cost of the selected product
  const [orderCost, setOrderCost] = useState(0); // To store and display the calculated order cost
  const [formData, setFormData] = useState({
    order_date: new Date().toISOString().split("T")[0], // Default to today's date
    product_id: "",
    supplier_id: "",
    quantity: 1, // Default quantity
  });
  const locationId = localStorage.getItem("location_id");

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

  const fetchSuppliers = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/suppliers-by-product/${productId}`
      );
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setFormData((prev) => ({ ...prev, product_id: productId, supplier_id: "" }));
    fetchSuppliers(productId);

    // Find the selected product's cost and update the state
    const selectedProduct = products.find(
      (product) => product.product_id === parseInt(productId)
    );
    if (selectedProduct) {
      const cost = selectedProduct.cost || 0; // Use the cost of the selected product
      setProductCost(cost);
      // Calculate the order cost based on quantity
      setOrderCost(cost * formData.quantity);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update the order cost dynamically when quantity changes
    if (name === "quantity") {
      const newQuantity = parseInt(value) || 0; // Ensure quantity is a valid number
      setOrderCost(productCost * newQuantity);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/purchase-orders", {
        ...formData,
        location_id: locationId,
        order_status: "Awaiting Approval", // Set default status
        total_amount: productCost * formData.quantity, // Calculate total cost
      });
      alert("Purchase Order Created Successfully!");
      setFormData({
        order_date: new Date().toISOString().split("T")[0],
        product_id: "",
        supplier_id: "",
        quantity: 1,
      });
      setProductCost(0); // Reset product cost
      setOrderCost(0); // Reset order cost
      setSuppliers([]);
    } catch (error) {
      console.error("Error creating purchase order:", error);
      alert("Failed to create purchase order.");
    }
  };

  return (
    <div className="create-purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>

      <h2>Create New Purchase Order</h2>
      <form className="purchase-order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order Date</label>
          <input
            type="date"
            name="order_date"
            value={formData.order_date}
            onChange={handleInputChange}
            required
          />
        </div>
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
          <label>Supplier</label>
          <select
            name="supplier_id"
            value={formData.supplier_id}
            onChange={handleInputChange}
            required
            disabled={!formData.product_id}
          >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplier_id} value={supplier.supplier_id}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Create Purchase Order
        </button>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;
