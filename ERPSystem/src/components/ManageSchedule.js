import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "../styles/ManageSchedule.css";

const ManageSchedule = () => {
  const { id } = useParams(); // Get employee ID from URL
  const [attendance, setAttendance] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [currentMonth]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/attendance/${id}`, {
        params: { month: currentMonth.getMonth() + 1, year: currentMonth.getFullYear() },
      });
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setStatusDropdown(true);
  };

  const handleStatusChange = async (status) => {
    if (!selectedDate) return;
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      await axios.post("http://localhost:5000/attendance", {
        employee_id: id,
        date: formattedDate,
        status,
      });
      setAttendance((prev) => [
        ...prev.filter((record) => record.date !== formattedDate),
        { employee_id: id, date: formattedDate, status },
      ]);
      setStatusDropdown(false);
    } catch (error) {
      console.error("Error updating attendance status:", error);
    }
  };

  // Remaining component logic (rendering the calendar, etc.) stays the same

  return (
    <div className="manage-schedule-module">
      <div className="home-icon">
        <FaHome size={30} onClick={() => window.history.back()} />
      </div>
      <h2>Manage Schedule</h2>
      {/* Calendar rendering and dropdown logic */}
    </div>
  );
};

export default ManageSchedule;
