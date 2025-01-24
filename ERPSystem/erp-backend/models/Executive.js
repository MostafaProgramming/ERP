const Person = require('./Person');

class Executive extends Person {
    constructor(personId, name, email, role, salary, departmentId, locationId, hireDate, region, strategy_focus_area) {
        super(personId, name, email, role, salary, departmentId, locationId, hireDate);
        this.region = region;
        this.strategy_focus_area = strategy_focus_area;
    }

    // Executive-specific methods
    static async fetchAllExecutives(pool) {
        try {
            const result = await pool.query(
                `SELECT p.*, e.region, e.strategy_focus_area
                 FROM person p
                 JOIN executive e ON p.person_id = e.person_id`
            );
            console.log("Fetched all executives:", result.rows);
            return result.rows;
        } catch (error) {
            console.error("Error fetching executives:", error);
            throw error;
        }
    }

    async addExecutive(pool) {
        await pool.query(
            `INSERT INTO executive (person_id, region, strategy_focus_area)
             VALUES ($1, $2, $3)`,
            [this.personId, this.region, this.strategy_focus_area]
        );
    }

     async updateExecutive(pool) {
        try {
            // Update the base Person data
            await super.updatePerson(pool);

            // Check if a row exists in the manager table
            const result = await pool.query(
                `SELECT 1 FROM executive WHERE person_id = $1`,
                [this.personId]
            );

            if (result.rowCount === 0) {
                // Insert new row if it doesn't exist
                console.log("No existing Executive record found. Inserting new row...");
                await pool.query(
                    `INSERT INTO executive (person_id, region, strategy_focus_area)
                     VALUES ($1, $2, $3)`,
                    [this.personId, this.region, this.strategy_focus_area]
                );
            } else {
                // Update existing row
                console.log("Updating Executive Data:", this);
                await pool.query(
                    `UPDATE executive
                     SET region = $1, strategy_focus_area = $2
                     WHERE person_id = $4`,
                    [this.region, this.strategy_focus_area, this.personId]
                );
            }

            console.log("Executive data saved successfully.");
        } catch (error) {
            console.error("Error updating Executive data:", error);
            throw error;
        }
    }
    
    async deletes(pool) {
        try {
            // Delete executive-specific data
            console.log(`Deleting Executive Data for Person ID: ${this.personId}`);
            await pool.query(`DELETE FROM executive WHERE person_id = $1`, [this.personId]);

            // Call the base class delete method
            await super.deletes(pool);
            console.log("Executive deleted successfully.");
        } catch (error) {
            console.error("Error deleting executive:", error);
            throw error;
        }
    }
}

module.exports = Executive;
