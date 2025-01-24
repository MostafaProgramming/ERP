const Person = require('./Person');

class Manager extends Person {
    constructor(personId, name, email, role, salary, departmentId, locationId, hireDate, absences, teamSize, approvalLimit) {
        super(personId, name, email, role, salary, departmentId, locationId, hireDate);
        this.teamSize = teamSize;
        this.approvalLimit = approvalLimit;
        this.absences = absences;
    }

    // Manager-specific methods

    static async fetchAllManagers(pool) {
        try {
            const result = await pool.query(
                `SELECT p.*, m.absences,m.team_size, m.approval_limit
                 FROM person p
                 JOIN manager m ON p.person_id = m.person_id`
            );
            console.log("Fetched all managers:", result.rows);
            return result.rows;
        } catch (error) {
            console.error("Error fetching managers:", error);
            throw error;
        }
    }

    async updateManager(pool) {
        try {
            // Update the base Person data
            await super.updatePerson(pool);

            // Check if a row exists in the manager table
            const result = await pool.query(
                `SELECT 1 FROM manager WHERE person_id = $1`,
                [this.personId]
            );

            if (result.rowCount === 0) {
                // Insert new row if it doesn't exist
                console.log("No existing Manager record found. Inserting new row...");
                await pool.query(
                    `INSERT INTO manager (person_id, absences, team_size, approval_limit)
                     VALUES ($1, $2, $3, $4)`,
                    [this.personId, this.absences, this.teamSize, this.approvalLimit]
                );
            } else {
                // Update existing row
                console.log("Updating Manager Data:", this);
                await pool.query(
                    `UPDATE manager
                     SET absences = $1, team_size = $2, approval_limit = $3
                     WHERE person_id = $4`,
                    [this.absences, this.teamSize, this.approvalLimit, this.personId]
                );
            }

            console.log("Manager data saved successfully.");
        } catch (error) {
            console.error("Error updating Manager data:", error);
            throw error;
        }
    }

    async addManager(pool) {
        await pool.query(
            `INSERT INTO manager (person_id, absences, team_size, approval_limit)
             VALUES ($1, $2, $3, $4)`,
            [this.personId, this.absences, this.teamSize, this.approvalLimit]
        );
    }

    async updateInDatabase(pool) {
        await super.updateInDatabase(pool);
        await pool.query(
            `UPDATE manager SET team_size = $1, approval_limit = $2 WHERE person_id = $3`,
            [this.teamSize, this.approvalLimit, this.personId]
        );
    }

    async deletes(pool) {
        try {
            // Delete manager-specific data
            console.log(`Deleting Manager Data for Person ID: ${this.personId}`);
            await pool.query(`DELETE FROM manager WHERE person_id = $1`, [this.personId]);

            // Call the base class delete method
            await super.deletes(pool);
            console.log("Manager deleted successfully.");
        } catch (error) {
            console.error("Error deleting manager:", error);
            throw error;
        }
    }
}

module.exports = Manager;
