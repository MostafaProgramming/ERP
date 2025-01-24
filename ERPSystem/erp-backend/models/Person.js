class Person {
    constructor(personId, name, email, role, salary, departmentId, locationId, hireDate) {
        this.personId = personId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.salary = salary;
        this.departmentId = departmentId;
        this.locationId = locationId;
        this.hireDate = hireDate;
    }

    // Common methods can go here
    static async fetchAllPersons(pool) {
        try {
            const result = await pool.query("SELECT * FROM person");
            console.log("Fetched all persons:", result.rows);
            return result.rows;
        } catch (error) {
            console.error("Error fetching persons:", error);
            throw error;
        }
    }
    
     // Save the person to the database
     async saveToDatabase(pool) {
        try {
            console.log("Saving Person Data:", this);
            const result = await pool.query(
                `INSERT INTO person (name, email, role, salary, department_id, location_id, hire_date)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING person_id`,
                [this.name, this.email, this.role, this.salary, this.departmentId, this.locationId, this.hireDate]
            );

            this.personId = result.rows[0].person_id; // Assign the returned ID
            console.log("Person Saved. Assigned ID:", this.personId);
        } catch (error) {
            console.error("Error saving Person data:", error);
            throw error;
        }
    }

    async updatePerson(pool) {
        try {
            console.log("Updating Person Data:", this);
            await pool.query(
                `UPDATE person
                 SET name = $1, email = $2, role = $3, salary = $4, department_id = $5, location_id = $6, hire_date = $7
                 WHERE person_id = $8`,
                [
                    this.name,
                    this.email,
                    this.role,
                    this.salary,
                    this.departmentId,
                    this.locationId,
                    this.hireDate,
                    this.personId
                ]
            );
            console.log("Person updated successfully.");
        } catch (error) {
            console.error("Error updating Person data:", error);
            throw error;
        }
    }  

    // Delete the person from the database
    async deletes(pool) {
        try {
            // Delete the person record
            console.log(`Deleting Person with ID: ${this.personId}`);
            await pool.query(`DELETE FROM person WHERE person_id = $1`, [this.personId]);
            console.log("Person deleted successfully.");
        } catch (error) {
            console.error("Error deleting person:", error);
            throw error;
        }
    }
}

module.exports = Person;
