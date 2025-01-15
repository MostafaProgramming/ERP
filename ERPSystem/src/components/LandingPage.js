import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = (action) => {
    switch (action) {
      case "inventory":
        navigate("/inventory");
        break;
      case "sales":
        navigate("/sales");
        break;
      case "schedule":
        navigate("/schedule");
        break;
      default:
        break;
    }
  };

  return (
    <div className="landing-buttons">
      <button onClick={() => handleButtonClick("inventory")}>
        Track Inventory
      </button>
      <button onClick={() => handleButtonClick("sales")}>Analyze Sales</button>
      <button onClick={() => handleButtonClick("schedule")}>
        Manage Employee Schedules
      </button>
    </div>
  );
};

export default LandingPage;
