import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EmployeeSchedule.css";

const EmployeeSchedule = () => {
  // State to store employee data and schedule data
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch employee and schedule data on component mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeResponse = await axios.get("http://localhost:5000/employees");
        setEmployees(employeeResponse.data);
        
        const scheduleResponse = await axios.get("http://localhost:5000/schedules");
        const scheduleData = scheduleResponse.data.reduce((acc, cur) => {
          acc[cur.employee_id] = {
            workingDays: cur.working_days,
            absences: cur.absences,
          };
          return acc;
        }, {});
        setSchedule(scheduleData);
      } catch (error) {
        console.error("Error fetching employee or schedule data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  // Handle schedule update (working or absence)
  const handleScheduleUpdate = async (employeeId, type, date) => {
    setSchedule((prev) => {
      const updated = { ...prev };
      if (type === "working") {
        if (!updated[employeeId]?.workingDays.includes(date)) {
          updated[employeeId].workingDays.push(date);
          updated[employeeId].absences = updated[employeeId].absences.filter(
            (d) => d !== date
          );
        }
      } else if (type === "absence") {
        if (!updated[employeeId]?.absences.includes(date)) {
          updated[employeeId].absences.push(date);
          updated[employeeId].workingDays = updated[
            employeeId
          ].workingDays.filter((d) => d !== date);
        }
      }
      return updated;
    });

    // Update the schedule in the backend
    try {
      await axios.put(`http://localhost:5000/schedules/${employeeId}`, {
        date,
        type,
      });
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  if (loading) {
    return <p>Loading employee schedule data...</p>;
  }

  return (
    <div className="employee-schedule-container">
      <div className="employee-list">
        <h2>Employees</h2>
        {employees.map((employee) => (
          <div key={employee.employee_id} className="employee-item">
            <p>{employee.name}</p>
            <span>{employee.role}</span>
          </div>
        ))}
      </div>
      <div className="schedule-calendar">
        <h2>Schedule</h2>
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
                      onClick={() =>
                        handleScheduleUpdate(
                          employee.employee_id,
                          schedule[employee.employee_id]?.workingDays.includes(date)
                            ? "absence"
                            : "working",
                          date
                        )
                      }
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