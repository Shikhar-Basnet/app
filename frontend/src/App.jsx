// App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated by verifying the JWT token on page load
        axios.get('http://localhost:5000', { withCredentials: true })
            .then((res) => {
                if (res.data.Status === 'Success') {
                    setIsAuthenticated(true);
                    setRole(res.data.role); // Store the role after token verification
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('authenticated', true);
                    
                    // If authenticated, navigate to the correct dashboard based on role
                    if (res.data.role === 'admin') {
                        navigate('/admin-dashboard');
                    } else if (res.data.role === 'user') {
                        navigate('/user-dashboard');
                    }
                } else {
                    setIsAuthenticated(false);
                    localStorage.setItem('authenticated', false);
                }
            })
            .catch((err) => {
                setIsAuthenticated(false);
                localStorage.setItem('authenticated', false);
                console.log(err);
            });
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* Protected routes */}
            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user-dashboard"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
