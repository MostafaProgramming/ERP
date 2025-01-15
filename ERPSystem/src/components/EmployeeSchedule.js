import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EmployeeSchedule.css";

const EmployeeSchedule = () => {
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's person_id and role from localStorage
  const personId = localStorage.getItem("person_id");
  const userRole = localStorage.getItem("role");

  // Get the current month and year to display
  const currentDate = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const fetchFilteredEmployees = async () => {
      try {
        // Fetch the manager's location_id or department_id
        const managerResponse = await axios.get(
          `http://localhost:5000/person`,
          { params: { person_id: personId } } // Send person_id as a query parameter
        );
        const { location_id, department_id } = managerResponse.data;

        // Determine how to fetch employees based on the user's role
        let employeeResponse;
        if (["Store Manager", "Warehouse Manager"].includes(userRole)) {
          // Fetch employees by location_id
          employeeResponse = await axios.get(
            `http://localhost:5000/person`,
            { params: { location_id } } // Send location_id as a query parameter
          );
        } else {
          // Fetch employees by department_id
          employeeResponse = await axios.get(
            `http://localhost:5000/person`,
            { params: { department_id } } // Send department_id as a query parameter
          );
        }

        setEmployees(employeeResponse.data);
        console.log("Fetched Filtered Employees:", employeeResponse.data);

        // Fetch schedules for the relevant employees
        const scheduleResponse = await axios.get(
          `http://localhost:5000/schedules`,
          { params: { person_id: personId } } // Send person_id as a query parameter
        );
        const scheduleData = scheduleResponse.data.reduce((acc, cur) => {
          acc[cur.employee_id] = {
            workingDays: cur.working_days,
            absences: cur.absences,
          };
          return acc;
        }, {});
        setSchedule(scheduleData);
      } catch (error) {
        console.error("Error fetching filtered employee or schedule data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredEmployees();
  }, [personId, userRole]);

  // Handle schedule update (working or absence)
  const handleScheduleUpdate = async (employeeId, date) => {
    setSchedule((prev) => {
      const updated = { ...prev };
      if (!updated[employeeId]) {
        updated[employeeId] = { workingDays: [], absences: [] };
      }

      // Determine the next state based on the current state
      if (
        !updated[employeeId].workingDays.includes(date) &&
        !updated[employeeId].absences.includes(date)
      ) {
        // Mark as Present (Green)
        updated[employeeId].workingDays.push(date);
      } else if (updated[employeeId].workingDays.includes(date)) {
        // Change from Present to Absent (Red)
        updated[employeeId].workingDays = updated[employeeId].workingDays.filter(
          (d) => d !== date
        );
        updated[employeeId].absences.push(date);
        incrementAbsences(employeeId); // Increment absences in the database
      } else if (updated[employeeId].absences.includes(date)) {
        // Reset to Unmarked (Gray)
        updated[employeeId].absences = updated[employeeId].absences.filter(
          (d) => d !== date
        );
        decrementAbsences(employeeId); // Decrement absences in the database
      }
      return updated;
    });

    // Update the schedule in the backend
    try {
      await axios.put(`http://localhost:5000/schedules/${employeeId}`, {
        date,
        type: "update",
      });
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  // Function to increment absences in the database
  const incrementAbsences = async (employeeId) => {
    try {
      await axios.put(`http://localhost:5000/person/${employeeId}/increment-absences`);
    } catch (error) {
      console.error("Error incrementing absences:", error);
    }
  };

  // Function to decrement absences in the database
  const decrementAbsences = async (employeeId) => {
    try {
      await axios.put(`http://localhost:5000/person/${employeeId}/decrement-absences`);
    } catch (error) {
      console.error("Error decrementing absences:", error);
    }
  };

  if (loading) {
    return <p>Loading employee schedule data...</p>;
  }

  return (
    <div className="employee-schedule-container">
      <div className="employee-list">
        <h2>Filtered Employees</h2>
        {employees.map((employee) => (
          <div key={employee.employee_id} className="employee-item">
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Role:</strong> {employee.role}</p>
            <p><strong>Location:</strong> {employee.location_id || "N/A"}</p>
            <p><strong>Department:</strong> {employee.department_id || "N/A"}</p>
            <hr />
          </div>
        ))}
      </div>
      <div className="schedule-calendar">
        <h2>Schedule</h2>
        <h3>{`${currentMonth} ${currentYear}`}</h3>
        <div className="calendar-grid">
          {employees.map((employee) => (
            <div key={employee.employee_id} className="calendar-row">
              <div className="employee-name">{employee.name}</div>
              <div className="calendar-dates">
                {[...Array(30).keys()].map((i) => {
                  const date = `2024-04-${String(i + 1).padStart(2, "0")}`;
                  return (
                    <div
                      key={date}
                      className={`calendar-cell ${
                        schedule[employee.employee_id]?.workingDays.includes(date)
                          ? "working"
                          : schedule[employee.employee_id]?.absences.includes(date)
                          ? "absent"
                          : ""
                      }`}
                      onClick={() => handleScheduleUpdate(employee.employee_id, date)}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSchedule;
