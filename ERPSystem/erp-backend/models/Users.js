class Users {
    constructor(userId, personId, password) {
        this.userId = userId;
        this.personId = personId;
        this.password = password; // Ensure passwords are hashed before storage
    }

    // Example method to validate the password
    validatePassword(inputPassword, hashedPassword) {
        // Add logic here to compare hashed passwords
        return inputPassword === hashedPassword;
    }
}

module.exports = Users;
