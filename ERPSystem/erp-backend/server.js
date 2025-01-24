const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const e = require('express');
require('dotenv').config();
const {Person, Employee, Manager, Executive} = require('./models');

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON payloads

// PostgreSQL Pool Setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Utility Function to Pre-hash Passwords (e.g., for Initial Data)
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// 1. Registration Endpoint
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await hashPassword(password); // Hash the password
    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).send('Server Error');
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query to fetch user information along with department_id and location_id
    const result = await pool.query(
      `SELECT 
         u.email, 
         u.role, 
         u.person_id, 
         p.department_id, 
         p.location_id, 
         u.password 
       FROM users u 
       JOIN person p ON u.person_id = p.person_id 
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare passwords

    if (isPasswordValid) {
      // Respond with full user information, including department_id and location_id
      res.status(200).json({
        message: 'Login successful',
        user: {
          email: user.email,
          role: user.role,
          person_id: user.person_id,
          department_id: user.department_id,
          location_id: user.location_id,
        },
      });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send('Server Error');
  }
});


// 3. Populate Initial Manager Data with Hashed Passwords (One-Time Use Script)
const populateManagers = async () => {
  const managers = [
    { email: 'store1@example.com', password: 'manager123', role: 'Store Manager', person_id: 4},
    { email: 'store2@example.com', password: 'manager123', role: 'Store Manager', person_id: 5 },
    { email: 'store3@example.com', password: 'manager123', role: 'Store Manager', person_id: 11 },
    { email: 'warehouse1@example.com', password: 'manager123', role: 'Warehouse Manager', person_id: 9 },
    { email: 'warehouse2@example.com', password: 'manager123', role: 'Warehouse Manager', person_id: 12 },
    { email: 'sales@example.com', password: 'manager123', role: 'Sales Manager', person_id: 13 },
    { email: 'hr@example.com', password: 'manager123', role: 'HR Manager',person_id: 14 },
    { email: 'finance@example.com', password: 'manager123', role: 'Finance Manager',person_id: 15 },
    { email: 'procurement@example.com', password: 'manager123', role: 'Procurement Manager', person_id: 16 },
  ];

  try {
    for (const manager of managers) {
      const hashedPassword = await hashPassword(manager.password); // Hash the password
      await pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
        [manager.email, hashedPassword, manager.role]
      );
    }
    console.log('Managers added successfully!');
  } catch (err) {
    console.error("Error populating managers:", err.message);
  }
};

// Call the populateManagers function once to insert the initial data
//populateManagers();

// Test Database Connection
pool.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the database successfully");
  }
});

// Improved error handling middleware
const handleDatabaseError = (res, error, customMessage) => {
  console.error(customMessage, error.message);
  res.status(500).json({ error: customMessage });
};

// Endpoints for Tables
// USER
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching users');
  }
});

// PERSON
app.get('/person', async (req, res) => {
  try {
    const { location_id, department_id } = req.query;

    let query = 'SELECT * FROM person';
    let queryParams = [];

    if (location_id) {
      query += ' WHERE location_id = $1';
      queryParams.push(location_id);
    } else if (department_id) {
      query += ' WHERE department_id = $1';
      queryParams.push(department_id);
    }

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching person data:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// MANAGER
app.get('/manager', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM manager');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching managers');
  }
});

// Employeee
app.get('/employee', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employee');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching employees');
  }
});

// Endpoint to Add a New Employee
app.post("/add-person", async (req, res) => {

 

  try {
    console.log("Incoming Request Body:", req.body);
    const {
      name,
      email,
      role,
      salary,
      department_id,
      location_id,
      hire_date,
      performance_rating,
      absences,
      team_size,
      approval_limit,
      region,
      strategy_focus_area
  } = req.body;

    console.log("Extracted Data:", { name, email, role, salary, department_id, location_id, hire_date });

      // Step 1: Create a base Person instance
      const person = new Person(null, name, email, role, salary, department_id, location_id, hire_date);
      await person.saveToDatabase(pool); // Save Person in the `person` table

      // Step 2: Create the specific Employee, Manager, or Executive based on the role
      let employeeInstance;
      if (role === "Employee") {
          employeeInstance = new Employee(
              person.personId,
              person.name,
              person.email,
              person.role,
              person.salary,
              person.departmentId,
              person.locationId,
              person.hireDate,
              performance_rating,
              absences
          );
          console.log("Saving Employee to Database...");
          await employeeInstance.addEmployee(pool);

      } else if (role === "Manager") {
          employeeInstance = new Manager(
              person.personId,
              person.name,
              person.email,
              person.role,
              person.salary,
              person.departmentId,
              person.locationId,
              person.hireDate,
              absences,
              team_size,
              approval_limit
          );
          console.log("Saving Manager to Database...");
          await employeeInstance.addManager(pool);

      } else if (role === "Executive") {
          employeeInstance = new Executive(
              person.personId,
              person.name,
              person.email,
              person.role,
              person.salary,
              person.departmentId,
              person.locationId,
              person.hireDate,
              region,
              strategy_focus_area
          );
          console.log("Saving Executive to Database...");
          await employeeInstance.addExecutive(pool);
      } else {
          return res.status(400).json({ error: "Invalid role specified." });
      }

      res.status(201).json({ message: `${role} added successfully!` });
  } catch (error) {
      console.error("Error adding employee:", error);
      res.status(500).json({ error: "Failed to add employee." });
  }
});

app.get("/all-persons", async (req, res) => {
  try {
      const persons = await Person.fetchAllPersons(pool);
      res.status(200).json(persons);
  } catch (error) {
      console.error("Error fetching persons:", error);
      res.status(500).json({ error: "Failed to fetch persons." });
  }
});

app.get("/all-employees", async (req, res) => {
  try {
      const employees = await Employee.fetchAllEmployees(pool);
      res.status(200).json(employees);
  } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees." });
  }
});

app.get("/all-managers", async (req, res) => {
  try {
      const managers = await Manager.fetchAllManagers(pool);
      res.status(200).json(managers);
  } catch (error) {
      console.error("Error fetching managers:", error);
      res.status(500).json({ error: "Failed to fetch managers." });
  }
});

app.get("/all-executives", async (req, res) => {
  try {
      const executives = await Executive.fetchAllExecutives(pool);
      res.status(200).json(executives);
  } catch (error) {
      console.error("Error fetching executives:", error);
      res.status(500).json({ error: "Failed to fetch executives." });
  }
});

app.put("/update-person/:id", async (req, res) => {
  try {
      console.log("Incoming Request Body:", req.body);

      const {
          name,
          email,
          role,
          salary,
          department_id,
          location_id,
          hire_date,
          performance_rating,
          absences,
          team_size,
          approval_limit,
          region,
          strategy_focus_area
      } = req.body;

      const personId = parseInt(req.params.id);

      // Fetch the existing role to determine which class to use
      const result = await pool.query("SELECT role FROM person WHERE person_id = $1", [personId]);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: "Person not found." });
      }

      const existingRole = result.rows[0].role;

      // Create a base Person instance
      const person = new Person(personId, name, email, role, salary, department_id, location_id, hire_date);

      // Create a specific class instance based on the role
      let employeeInstance;
      if (existingRole === "Employee") {
          employeeInstance = new Employee(person.personId, person.name, person.email, person.role, person.salary, person.departmentId, person.locationId, person.hireDate, performance_rating, absences);
          await employeeInstance.updateEmployee(pool);
        } else if (existingRole === "Manager") {
          employeeInstance = new Manager(person.personId, person.name, person.email, person.role, person.salary, person.departmentId, person.locationId, person.hireDate, absences, team_size, approval_limit);
          await employeeInstance.updateManager(pool);
        } else if (existingRole === "Executive") {
          employeeInstance = new Executive(person.personId, person.name, person.email, person.role, person.salary, person.departmentId, person.locationId, person.hireDate, region, strategy_focus_area);
          await employeeInstance.updateExecutive(pool);
        } else {
          return res.status(400).json({ error: "Invalid role specified." });
      }

      // Update the database using the appropriate class
      console.log("Updating Employee in Database...");
      

      res.status(200).json({ message: `${existingRole} updated successfully!` });
  } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ error: "Failed to update employee." });
  }
});



// Endpoint to Delete a Person
app.delete("/delete-person/:id", async (req, res) => {
  try {
      const personId = parseInt(req.params.id);

      // Fetch the existing role to determine which class to use
      const result = await pool.query("SELECT role FROM person WHERE person_id = $1", [personId]);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: "Person not found." });
      }

      const role = result.rows[0].role;

      // Create the appropriate class instance based on the role
      let personInstance;
      if (role === "Employee") {
          personInstance = new Employee(personId);
      } else if (role === "Manager") {
          personInstance = new Manager(personId);
      } else if (role === "Executive") {
          personInstance = new Executive(personId);
      } else {
          return res.status(400).json({ error: "Invalid role specified." });
      }

      // Call the delete method
      console.log(`Deleting ${role} with ID: ${personId}`);
      await personInstance.deletes(pool);

      res.status(200).json({ message: `${role} deleted successfully.` });
  } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ error: "Failed to delete employee." });
  }
});


// DEPARTMENTS
app.get('/department', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching departments');
  }
});

// LOCATIONS
app.get('/location', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM location');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching locations');
  }
});
app.post("/location", async (req, res) => {
  try {
    const {
      location_name,
      location,
      manager_id,
      contact_number,
      location_type,
      operating_hours,
      customer_capacity,
      parking_spaces,
      storage_capacity,
      number_of_docks,
    } = req.body;

    // Insert into location table
    const locationResult = await pool.query(
      `INSERT INTO location (location_name, location, manager_id, contact_number, location_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING location_id`,
      [location_name, location, manager_id, contact_number, location_type]
    );

    const locationId = locationResult.rows[0].location_id;

    // Insert into specific table based on location_type
    if (location_type === "Store") {
      await pool.query(
        `INSERT INTO store (location_id, operating_hours, customer_capacity, parking_spaces)
         VALUES ($1, $2, $3, $4)`,
        [locationId, operating_hours, customer_capacity, parking_spaces]
      );
    } else if (location_type === "Warehouse") {
      await pool.query(
        `INSERT INTO warehouse (location_id, storage_capacity, number_of_docks)
         VALUES ($1, $2, $3)`,
        [locationId, storage_capacity, number_of_docks]
      );
    }

    res.status(201).json({ message: "Location added successfully" });
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ error: "Error adding location" });
  }
});

app.get("/person-managers", async (req, res) => {
  try {
    const result = await pool.query(`SELECT person_id, name FROM person WHERE role LIKE '%Manager'`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching managers:", error);
    res.status(500).json({ error: "Error fetching managers" });
  }
});

// STORES
app.get('/store', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM store');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching stores');
  }
});
// Endpoint to fetch all warehouses
app.get("/warehouse-locations", async (req, res) => {
  try {
    const { location_type } = req.query;

    // Fetch locations based on the location_type
    const result = await pool.query(
      "SELECT location_id, location_name, location_type FROM location WHERE location_type = $1",
      [location_type]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// WAREHOUSES
app.get('/warehouse', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM warehouse');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching warehouses');
  }
});

// SUPPLIERS
// Get all suppliers
app.get("/suppliers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM supplier");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Error fetching suppliers" });
  }
});

// Get a single supplier by ID
app.get("/suppliers/:supplierId", async (req, res) => {
  const { supplierId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM supplier WHERE supplier_id = $1", [supplierId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching supplier:", err);
    res.status(500).json({ error: "Error fetching supplier" });
  }
});

// Add a new supplier
app.post("/suppliers", async (req, res) => {
  const { supplier_name, contact_details, location, contract_terms } = req.body;
  console.log("Request body:", req.body); // Log request body

  try {
    await pool.query(
      `INSERT INTO supplier (supplier_name, contact_details, location, contract_terms) 
       VALUES ($1, $2, $3, $4)`,
      [supplier_name, contact_details, location, contract_terms]
    );
    res.status(201).json({ message: "Supplier added successfully" });
  } catch (err) {
    console.error("Error adding supplier:", err);
    res.status(500).json({ error: "Error adding supplier" });
  }
});



// Update a supplier
app.put("/suppliers/:supplierId", async (req, res) => {
  const { supplierId } = req.params;
  const { supplier_name, contact_details, location, contract_terms } = req.body;
  try {
    const result = await pool.query(
      "UPDATE supplier SET supplier_name = $1, contact_details = $2, location = $3, contract_terms = $4 WHERE supplier_id = $5",
      [supplier_name, contact_details, location, contract_terms, supplierId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json({ message: "Supplier updated successfully." });
  } catch (err) {
    console.error("Error updating supplier:", err);
    res.status(500).json({ error: "Error updating supplier" });
  }
});

// Delete a supplier
app.delete("/suppliers/:supplierId", async (req, res) => {
  const { supplierId } = req.params;
  try {
    const result = await pool.query("DELETE FROM supplier WHERE supplier_id = $1", [supplierId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json({ message: "Supplier deleted successfully." });
  } catch (err) {
    console.error("Error deleting supplier:", err);
    res.status(500).json({ error: "Error deleting supplier" });
  }
});


app.get('/suppliers-by-product/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const suppliers = await pool.query(`
      SELECT supplier.supplier_id, supplier.supplier_name
      FROM supplier
      JOIN product ON supplier.supplier_id = product.supplier_id
      WHERE product.product_id = $1
    `, [productId]);
    res.json(suppliers.rows);
  } catch (error) {
    console.error("Error fetching suppliers for product:", error.message);
    res.status(500).send("Server error");
  }
});


// PRODUCTS
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});
app.post("/products", async (req, res) => {
  const {
    product_name,
    category,
    price,
    stock_level,
    reorder_level,
    last_purchase_date,
    supplier_id,
    cost,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO product (product_name, category, price, stock_level, reorder_level, last_purchase_date, supplier_id, cost) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [product_name, category, price, stock_level, reorder_level, last_purchase_date, supplier_id, cost]
    );
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Error adding product" });
  }
});



// INVENTORY
app.get("/inventory", async (req, res) => {
  const { location_id } = req.query;

  try {
    let query = `
      SELECT 
        inventory.inventory_id,
        inventory.product_id,
        inventory.location_id,
        inventory.quantity,
        inventory.last_updated,
        product.product_name,
        product.category,
        location.location_name
      FROM inventory
      JOIN product ON inventory.product_id = product.product_id
      JOIN location ON inventory.location_id = location.location_id
    `;

    if (location_id) {
      query += ` WHERE inventory.location_id = $1`;
      const result = await pool.query(query, [location_id]);
      return res.json(result.rows);
    }

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching inventory data:", error.message);
    res.status(500).send("Server Error");
  }
});


// SALES RECORD
app.get('/sales-record', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sales_record');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching sales records');
  }
});

app.post("/sales-records", async (req, res) => {
  const { store_id, manager_id, product_id, quantity_sold, date_of_sale, total_amount, payment_method } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO sales_record (store_id, manager_id, product_id, quantity_sold, date_of_sale, total_amount, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING sales_id",
      [store_id, manager_id, product_id, quantity_sold, date_of_sale, total_amount, payment_method]
    );
    res.json({ message: "Sales record added successfully.", sales_id: result.rows[0].sales_id });
  } catch (err) {
    console.error("Error adding sales record:", err);
    res.status(500).json({ error: "Error adding sales record." });
  }
});


// PERSON
app.get('/sales-by-store', async (req, res) => {
  try {
    const { location_id, department_id } = req.query;

    let query = 'SELECT * FROM sales_record';
    let queryParams = [];

    if (location_id) {
      query += ' WHERE store_id = $1';
      queryParams.push(location_id);
    } else if (department_id) {
      query += ' WHERE department_id = $1';
      queryParams.push(department_id);
    }

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching person data:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/sales-trends", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(date_of_sale, 'Month') AS month, 
        SUM(total_amount) AS total_sales
      FROM sales_record
      GROUP BY TO_CHAR(date_of_sale, 'Month')
      ORDER BY MIN(date_of_sale);
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sales trends:", err.message);
    res.status(500).send("Server Error");
  }
});


app.get("/sales-trends-by-product", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.product_name, 
        SUM(sr.quantity_sold) AS total_quantity
      FROM sales_record sr
      JOIN product p ON sr.product_id = p.product_id
      GROUP BY p.product_name
      ORDER BY total_quantity DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching product sales trends:", error.message);
    res.status(500).send("Server error");
  }
});


// PURCHASE ORDERS
app.get('/purchase-orders', async (req, res) => {
  const { location_id } = req.query;
  let query = `
    SELECT po.*, p.product_name, s.supplier_name
    FROM purchase_order po
    JOIN product p ON po.product_id = p.product_id
    JOIN supplier s ON po.supplier_id = s.supplier_id
  `;
  if (location_id) {
    query += ` WHERE po.location_id = $1`;
    const result = await pool.query(query, [location_id]);
    res.json(result.rows);
  } else {
    const result = await pool.query(query);
    res.json(result.rows);
  }
});

app.put('/purchase-orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await pool.query(
    `UPDATE purchase_order SET order_status = $1 WHERE purchase_order_id = $2`,
    [status, id]
  );
  res.json({ message: 'Order status updated successfully' });
});

app.get("/orders", async (req, res) => {
  try {
    const { order_type, location_id } = req.query;
    let query = `
      SELECT o.order_id, o.product_id, o.quantity, o.total_amount, o.status, 
             o.delivery_date, p.product_name
      FROM orders o
      JOIN product p ON o.product_id = p.product_id
      WHERE o.order_type = $1
    `;
    const params = [order_type];

    if (location_id) {
      query += ` AND o.order_id IN (
        SELECT order_id FROM purchase_orders WHERE location_id = $2
      )`;
      params.push(location_id);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

app.get("/stock-transfers", async (req, res) => {
  const { order_type, location_id } = req.query;

  try {
    let query = `
      SELECT o.*, st.source_location_id, st.destination_location_id, p.product_name 
      FROM orders o
      JOIN stock_transfers st ON o.order_id = st.order_id
      JOIN product p ON o.product_id = p.product_id
      WHERE o.order_type = $1
    `;
    const params = [order_type];

    if (location_id) {
      query += ` AND (st.source_location_id = $2 OR st.destination_location_id = $2)`;
      params.push(location_id);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stock transfers:", err);
    res.status(500).json({ error: "Error fetching stock transfers" });
  }
});

app.put("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1::VARCHAR, updated_at = NOW(), 
           delivery_date = CASE WHEN $1 = 'Completed' THEN NOW() ELSE NULL END 
       WHERE order_id = $2
       RETURNING *`,
      [status, orderId]
    );
    

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Error updating order status" });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const {
      order_date,
      product_id,
      quantity,
      location_id, // Destination location for stock transfers
      order_type,
      source_location_id, // For stock_transfer
      supplier_id, // For purchase_order
    } = req.body;

    // Fetch product cost from the product table
    const productResult = await pool.query(
      "SELECT cost FROM product WHERE product_id = $1",
      [product_id]
    );

    if (productResult.rowCount === 0) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const productCost = productResult.rows[0].cost;
    const totalAmount = productCost * quantity;

    // Insert into the orders table
    const orderResult = await pool.query(
      `INSERT INTO orders (order_date, product_id, quantity, order_type, status, total_amount, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING order_id`,
      [order_date, product_id, quantity, order_type, "Awaiting Approval", totalAmount]
    );

    const orderId = orderResult.rows[0].order_id;

    if (order_type === "stock_transfer") {
      // Insert into stock_transfers table
      await pool.query(
        `INSERT INTO stock_transfers (order_id, source_location_id, destination_location_id)
         VALUES ($1, $2, $3)`,
        [orderId, source_location_id, location_id]
      );
    } else if (order_type === "purchase_order") {
      // Insert into purchase_orders table
      await pool.query(
        `INSERT INTO purchase_orders (order_id, supplier_id, location_id)
         VALUES ($1, $2, $3)`,
        [orderId, supplier_id, location_id]
      );
    }

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
});


app.post('/purchase-orders', async (req, res) => {
  const { order_date, product_id, supplier_id, quantity, location_id } = req.body;

  try {
    const totalAmountQuery = await pool.query(
      `SELECT price FROM product WHERE product_id = $1`, 
      [product_id]
    );

    if (totalAmountQuery.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    const totalAmount = totalAmountQuery.rows[0].price * quantity;

    const newOrder = await pool.query(
      `INSERT INTO purchase_order (product_id, supplier_id, order_date, quantity, total_amount, order_status, location_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [product_id, supplier_id, order_date, quantity, totalAmount, "Awaiting Approval", location_id]
    );

    res.status(201).json(newOrder.rows[0]);
  } catch (error) {
    console.error("Error creating purchase order:", error.message);
    res.status(500).send("Server error");
  }
});


// FINANCIAL REPORT
app.get('/financial-report', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM financial_report');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching financial reports');
  }
});
app.get("/financial-reports", async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    // Construct date filters
    let dateFilterSales = "";
    let dateFilterPurchaseOrders = "";

    if (start_date && end_date) {
      dateFilterSales = `WHERE date_of_sale BETWEEN '${start_date}' AND '${end_date}'`;
      dateFilterPurchaseOrders = `AND order_date BETWEEN '${start_date}' AND '${end_date}'`;
    }

    // Total Sales
    const salesResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS total_sales FROM sales_record ${dateFilterSales}`
    );
    const totalSales = salesResult.rows[0].total_sales;

    // Total Expenses
    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_expenses FROM expenses`
    );
    const totalExpenses = expenseResult.rows[0].total_expenses;

    // Total Salaries
    const salaryResult = await pool.query(
      `SELECT COALESCE(SUM(salary), 0) AS total_salaries FROM person`
    );
    const totalSalaries = salaryResult.rows[0].total_salaries;

    // Total Purchase Orders
    const purchaseOrderResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS total_purchase_orders 
       FROM orders 
       WHERE order_type = 'purchase_order' ${dateFilterPurchaseOrders}`
    );
    const totalPurchaseOrders = purchaseOrderResult.rows[0].total_purchase_orders;

    // Calculate Profit
    const profit = totalSales - (totalExpenses + totalSalaries + totalPurchaseOrders);

    // Send the result as JSON
    res.json({
      total_sales: totalSales,
      total_expenses: totalExpenses,
      total_salaries: totalSalaries,
      total_purchase_orders: totalPurchaseOrders,
      profit: profit,
    });
  } catch (err) {
    console.error("Error generating financial report:", err);
    res.status(500).json({ error: "Failed to generate financial report." });
  }
});


// ATTENDANCE
// Fetch attendance for a specific employee
app.get('/attendance/:person_id', async (req, res) => {
  const { person_id } = req.params;

  try {
    const attendanceData = await pool.query(
      `SELECT date, status FROM attendance WHERE person_id = $1`,
      [person_id]
    );

    res.json(attendanceData.rows);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Update or insert attendance
app.post('/attendance', async (req, res) => {
  const { person_id, date, status } = req.body;
  console.log('Attendance update request:', { person_id, date, status });
  try {
    const result = await pool.query(
      `INSERT INTO attendance (person_id, date, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (person_id, date)
       DO UPDATE SET status = $3`,
      [person_id, date, status]
    );
    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//EXPENSES
app.get("/expenses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const {
      amount,
      department_id,
      budget_id,
      category,
      date_of_expense,
      description,
      person_id,
    } = req.body;

    await pool.query(
      `INSERT INTO expenses (amount, department_id, budget_id, category, date_of_expense, description, person_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [amount, department_id, budget_id, category, date_of_expense, description, person_id]
    );

    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Error adding expense" });
  }
});




// BUDGET
app.get("/budget", async (req, res) => {
  try {
    const result = await pool.query("SELECT budget_id, category FROM budget");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Error fetching budgets" });
  }
});

app.post("/budgets", async (req, res) => {
  const {
    department_id,
    allocated_amount,
    start_date,
    end_date,
    description,
    category,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO budget (department_id, allocated_amount, start_date, end_date, description, category)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [department_id, allocated_amount, start_date, end_date, description, category]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding budget:", error);
    res.status(500).json({ error: "Error adding budget" });
  }
});

app.get("/budgets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM budget ORDER BY budget_id");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Error fetching budgets" });
  }
});


// STOCK TRANSFERS
app.get('/stock-transfer', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stock_transfer');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(res, err, 'Error fetching stock transfers');
  }
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).send('Sorry, that endpoint does not exist.');
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
