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
import AdminProfile from './components/profile/AdminProfile';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication status when app loads
        const checkAuthStatus = async () => {
            try {
                const res = await axios.get('http://localhost:5000', { withCredentials: true });

                if (res.data.Status === 'Success') {
                    setIsAuthenticated(true);
                    setRole(res.data.role);
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('authenticated', true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.setItem('authenticated', false);
                    navigate('/login'); // Redirect to login if not authenticated
                }
            } catch (err) {
                console.log('Error during authentication check:', err);
                setIsAuthenticated(false);
                localStorage.setItem('authenticated', false);
                navigate('/login'); // Redirect to login if error occurs
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
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
                            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user-dashboard"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="user">
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin-profile"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="admin">
                                <AdminProfile />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            )}
        </>
    );
}

export default App;
