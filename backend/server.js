import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const port = 5000;
const salt = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

// Middleware to verify user
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not valid" });
            } else {
                req.name = decoded.name;
                req.role = decoded.role;
                next();
            }
        });
    }
};

// Middleware to verify roles
const verifyRole = (role) => (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    }
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.json({ Error: "Token is not valid" });
        } else if (decoded.role !== role) {
            return res.json({ Error: "Access denied" });
        } else {
            req.name = decoded.name;
            req.role = decoded.role;
            next();
        }
    });
};

// Default route that checks authentication status
app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name, role: req.role });
});

// Admin dashboard route
app.get('/admin', verifyRole('admin'), (req, res) => {
    return res.json({ Status: "Success", message: `Welcome! Dear ${req.name}` });
});

// Admin statistics route: Fetch total users, active users, new registrations, and monthly registration data
app.get('/admin/stats', verifyRole('admin'), (req, res) => {
    const sqlTotalUsers = "SELECT COUNT(*) AS total_users FROM login";
    const sqlActiveUsers = "SELECT COUNT(*) AS active_users FROM login WHERE status = 'active'"; // Assuming 'status' field exists for user status
    const sqlNewRegistrations = "SELECT COUNT(*) AS new_registrations FROM login WHERE registration_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)"; // Assuming `registration_date` exists

    // SQL query for monthly registration data
    const sqlMonthlyRegistrations = `
        SELECT MONTH(registration_date) AS month, COUNT(*) AS registrations
        FROM login
        WHERE registration_date > DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY MONTH(registration_date)
        ORDER BY MONTH(registration_date)
    `;

    // Get total users
    db.query(sqlTotalUsers, (err, totalUsersData) => {
        if (err) return res.json({ Error: "Error fetching total users!" });
        
        // Get active users
        db.query(sqlActiveUsers, (err, activeUsersData) => {
            if (err) return res.json({ Error: "Error fetching active users!" });

            // Get new registrations
            db.query(sqlNewRegistrations, (err, newRegistrationsData) => {
                if (err) return res.json({ Error: "Error fetching new registrations!" });

                // Get monthly registrations data
                db.query(sqlMonthlyRegistrations, (err, monthlyRegistrationsData) => {
                    if (err) return res.json({ Error: "Error fetching monthly registrations!" });

                    // Prepare monthly registrations data
                    const monthlyRegistrations = [0, 0, 0, 0, 0, 0]; // Default to 6 months of 0 registrations
                    monthlyRegistrationsData.forEach(row => {
                        monthlyRegistrations[row.month - 1] = row.registrations; // Adjust for 0-indexed array
                    });

                    // Return all statistics including monthly registration data
                    return res.json({
                        Status: "Success",
                        totalUsers: totalUsersData[0].total_users,
                        activeUsers: activeUsersData[0].active_users,
                        newRegistrations: newRegistrationsData[0].new_registrations,
                        monthlyRegistrations: monthlyRegistrations
                    });
                });
            });
        });
    });
});


// User dashboard route
app.get('/user', verifyRole('user'), (req, res) => {
    return res.json({ Status: "Success", message: `Welcome User ${req.name}` });
});

// Register route
app.post('/register', (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`, `role`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password!" });
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.role || 'user' // Default role is 'user'
        ];
        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Error inserting data!" });
            return res.json({ Status: "Success" });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Login error in server" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    const name = data[0].name;
                    const role = data[0].role; // Include role
                    const token = jwt.sign({ name, role }, "jwt-secret-key", { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true, secure: false }); // Send token in cookies
                    return res.json({ Status: "Success", role }); // Send role in the response
                } else {
                    return res.json({ Error: "Incorrect Password" });
                }
            });
        } else {
            return res.json({ Error: "No Email existed!" });
        }
    });
});

// Logout route in backend
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
