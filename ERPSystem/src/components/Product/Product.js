import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../../styles/Inventory.css"; // Reuse Inventory CSS

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={24} title="Go Back" onClick={() => window.history.back()} />
      </div>

      <h2>Product Catalogue</h2>
      <div className="inventory-search">
        <input
          type="text"
          placeholder="Search by Product Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock Level</th>
              <th>Reorder Level</th>
              <th>Last Purchase Date</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stock_level}</td>
                <td>{product.reorder_level}</td>
                <td>{new Date(product.last_purchase_date).toLocaleDateString()}</td>
                <td>{product.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add Product Button */}
      <div className="add-product-button-container">
        <button
          className="add-product-button"
          onClick={() => navigate("/procurement-manager/manage-products/add-product")}
        >
          Add New Product
        </button>
      </div>
    </div>
  );
};

export default Products;
