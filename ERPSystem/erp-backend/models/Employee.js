const Person = require('./Person');

class Employee extends Person {
    constructor(personId, name, email, role, salary, departmentId, locationId, hireDate, performanceRating, absences) {
        super(personId, name, email, role, salary, departmentId, locationId, hireDate);
        this.performanceRating = performanceRating;
        this.absences = absences;
    }

    // Additional methods specific to Employee
    static async fetchAllEmployees(pool) {
        try {
            const result = await pool.query(
                `SELECT p.*, e.performance_rating, e.absences
                 FROM person p
                 JOIN employee e ON p.person_id = e.person_id`
            );
            console.log("Fetched all employees:", result.rows);
            return result.rows;
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    }
    // Save employee-specific details to the database
    async addEmployee(pool) {
        // Save role-specific details
        try{
            await pool.query(
                `INSERT INTO employee (person_id, performance_rating, absences)
                 VALUES ($1, $2, $3)`,
                [this.personId, this.performanceRating, this.absences]
            );
            
            console.log('Employee Data Saved:', this.personId, this.performanceRating, this.absences);

        } catch (error) {
            console.error("Error saving employee details" , error);
            throw error;
        }
        
    }

    // Update employee-specific details in the database
    async updateEmployee(pool) {
        try {
            // Update the base Person data
            await super.updatePerson(pool);

            // Check if a row exists in the manager table
            const result = await pool.query(
                `SELECT 1 FROM employee WHERE employee_id = $1`,
                [this.personId]
            );

            if (result.rowCount === 0) {
                // Insert new row if it doesn't exist
                console.log("No existing Employee record found. Inserting new row...");
                await pool.query(
                    `INSERT INTO employee (person_id, absences, performance_rating)
                     VALUES ($1, $2, $3)`,
                    [this.personId, this.absences, this.performanceRating]
                );
            } else {
                // Update existing row
                console.log("Updating Employee Data:", this);
                await pool.query(
                    `UPDATE employee
                     SET absences = $1, performance_rating = $2
                     WHERE person_id = $3`,
                    [this.absences, this.performanceRating, this.personId]
                );
            }

            console.log("Employee data saved successfully.");
        } catch (error) {
            console.error("Error updating Employee data:", error);
            throw error;
        }
    }

    async deletes(pool) {
        try {
            // Delete employee-specific data
            console.log(`Deleting Employee Data for Person ID: ${this.personId}`);
            await pool.query(`DELETE FROM employee WHERE person_id = $1`, [this.personId]);

            // Call the base class delete method
            await super.deletes(pool);
            console.log("Employee deleted successfully.");
        } catch (error) {
            console.error("Error deleting employee:", error);
            throw error;
        }
    }
}

module.exports = Employee;
