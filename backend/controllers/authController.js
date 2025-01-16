import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../models/db.js';

const saltRounds = 10;

export const register = (req, res) => {
    const { name, email, password, role = 'user' } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password!" });
        const sql = "INSERT INTO login (`name`, `email`, `password`, `role`) VALUES (?)";
        const values = [name, email, hash, role];

        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Error inserting data!" });
            return res.json({ Status: "Success" });
        });
    });
};

export const login = (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM login WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) return res.json({ Error: "Login error in server" });
        if (data.length > 0) {
            bcrypt.compare(password, data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    const { name, role } = data[0];
                    const token = jwt.sign({ name, role }, "jwt-secret-key", { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true, secure: false });
                    return res.json({ Status: "Success", role });
                } else {
                    return res.json({ Error: "Incorrect Password" });
                }
            });
        } else {
            return res.json({ Error: "No Email existed!" });
        }
    });
};
/////////////////////////////////////////
export const checkAuth = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Status: 'Error', message: 'Unauthorized: No token provided.' });
    }

    jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ Status: 'Error', message: 'Unauthorized: Invalid token.' });
        }

        return res.json({ Status: 'Success', name: decoded.name, role: decoded.role });
    });
};
////////////////////////////////////////////
// authController.js


export const logout = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        // No active session, but treat it as a success to ensure the user is logged out
        return res.status(200).json({ 
            Status: "Success", 
            message: "No active session, but logout processed." 
        });
    }

    res.clearCookie('token', { httpOnly: true, secure: true });
    return res.status(200).json({ 
        Status: "Success", 
        message: "Logged out successfully." 
    });
};
