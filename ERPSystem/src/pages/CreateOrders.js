import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../styles/CreatePurchaseOrder.css"; // Reuse the existing CSS file

export const CreateOrder = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]); // To store warehouse options
  const [productCost, setProductCost] = useState(0); // To store the cost of the selected product
  const [orderCost, setOrderCost] = useState(0); // To store and display the calculated order cost
  const [formData, setFormData] = useState({
    order_date: new Date().toISOString().split("T")[0], // Default to today's date
    product_id: "",
    supplier_id: "",
    source_location_id: "", // For stock transfer
    quantity: 1, // Default quantity
  });
  const locationId = localStorage.getItem("location_id"); // Destination location for stock transfers
  const userRole = localStorage.getItem("role"); // Store Manager or Warehouse Manager

  useEffect(() => {
    fetchProducts();
    if (userRole === "Store Manager") {
      fetchWarehouses(); // Fetch warehouses only for stock transfers
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/warehouse-locations", {
        params: { location_type: "Warehouse" },
      });
      setWarehouses(response.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
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
      const orderType = userRole === "Store Manager" ? "stock_transfer" : "purchase_order";

      const orderData = {
        order_date: formData.order_date,
        product_id: formData.product_id,
        quantity: formData.quantity,
        location_id: locationId, // Store Manager's location (destination for stock transfers)
        order_type: orderType,
        status: "Awaiting Approval", // Default status
      };

      if (orderType === "stock_transfer") {
        orderData.source_location_id = formData.source_location_id;
        orderData.destination_location_id = locationId; // Auto-set destination location
      } else if (orderType === "purchase_order") {
        orderData.supplier_id = formData.supplier_id;
        orderData.total_amount = productCost * formData.quantity; // Calculate total cost
      }

      await axios.post("http://localhost:5000/orders", orderData);

      alert(`${orderType === "stock_transfer" ? "Stock Transfer" : "Purchase Order"} Created Successfully!`);
      setFormData({
        order_date: new Date().toISOString().split("T")[0],
        product_id: "",
        supplier_id: "",
        source_location_id: "",
        quantity: 1,
      });
      setProductCost(0); // Reset product cost
      setOrderCost(0); // Reset order cost
      setSuppliers([]);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create the order.");
    }
  };

  return (
    <div className="create-purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>

      <h2>Create New {userRole === "Store Manager" ? "Stock Transfer" : "Purchase Order"}</h2>
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

        {userRole === "Store Manager" && (
          <div className="form-group">
            <label>Source Location (Warehouse)</label>
            <select
              name="source_location_id"
              value={formData.source_location_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.location_id} value={warehouse.location_id}>
                  {warehouse.location_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {userRole === "Warehouse Manager" && (
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
        )}

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
          Create {userRole === "Store Manager" ? "Stock Transfer" : "Purchase Order"}
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;
