import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000', { withCredentials: true })
            .then((res) => {
                if (res.data.Status === 'Success') {
                    setIsAuthenticated(true);
                    setRole(res.data.role);
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('authenticated', true);
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
            })
            .finally(() => setLoading(false)); // Set loading to false after fetching
    }, [navigate]);

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.setItem('authenticated', false);
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border" role="status">
                    </div>
                </div>
            ) : (
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
            )}
        </>
    );
}

export default App;
