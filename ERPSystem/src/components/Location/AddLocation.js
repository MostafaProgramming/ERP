import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../../styles/CreatePurchaseOrder.css"; // Reuse existing styles

const AddLocation = () => {
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    location_name: "",
    location: "",
    manager_id: "",
    contact_number: "",
    location_type: "",
    operating_hours: "", // Store-specific
    customer_capacity: "", // Store-specific
    parking_spaces: "", // Store-specific
    storage_capacity: "", // Warehouse-specific
    number_of_docks: "", // Warehouse-specific
  });

  // Fetch managers for dropdown
  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/person-managers");
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        location_name: formData.location_name,
        location: formData.location,
        manager_id: formData.manager_id,
        contact_number: formData.contact_number,
        location_type: formData.location_type,
        ...(formData.location_type === "Store" && {
          operating_hours: formData.operating_hours,
          customer_capacity: parseInt(formData.customer_capacity, 10),
          parking_spaces: parseInt(formData.parking_spaces, 10),
        }),
        ...(formData.location_type === "Warehouse" && {
          storage_capacity: parseFloat(formData.storage_capacity),
          number_of_docks: parseInt(formData.number_of_docks, 10),
        }),
      };

      await axios.post("http://localhost:5000/location", payload);

      alert("Location added successfully.");
      setFormData({
        location_name: "",
        location: "",
        manager_id: "",
        contact_number: "",
        location_type: "",
        operating_hours: "",
        customer_capacity: "",
        parking_spaces: "",
        storage_capacity: "",
        number_of_docks: "",
      });
    } catch (error) {
      console.error("Error adding location:", error);
      alert("Failed to add location.");
    }
  };

  return (
    <div className="create-purchase-order-module">
      {/* Home Icon */}
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>

      <h2>Add New Location</h2>
      <form className="purchase-order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Location Name</label>
          <input
            type="text"
            name="location_name"
            value={formData.location_name}
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
          <label>Manager</label>
          <select
            name="manager_id"
            value={formData.manager_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a Manager</option>
            {managers.map((manager) => (
              <option key={manager.person_id} value={manager.person_id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location Type</label>
          <select
            name="location_type"
            value={formData.location_type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a Location Type</option>
            <option value="Store">Store</option>
            <option value="Warehouse">Warehouse</option>
          </select>
        </div>

        {/* Store-Specific Fields */}
        {formData.location_type === "Store" && (
          <>
            <div className="form-group">
              <label>Operating Hours</label>
              <input
                type="text"
                name="operating_hours"
                value={formData.operating_hours}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Customer Capacity</label>
              <input
                type="number"
                name="customer_capacity"
                value={formData.customer_capacity}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Parking Spaces</label>
              <input
                type="number"
                name="parking_spaces"
                value={formData.parking_spaces}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        {/* Warehouse-Specific Fields */}
        {formData.location_type === "Warehouse" && (
          <>
            <div className="form-group">
              <label>Storage Capacity</label>
              <input
                type="number"
                name="storage_capacity"
                value={formData.storage_capacity}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Number of Docks</label>
              <input
                type="number"
                name="number_of_docks"
                value={formData.number_of_docks}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-button">
          Add Location
        </button>
      </form>
    </div>
  );
};

export default AddLocation;
