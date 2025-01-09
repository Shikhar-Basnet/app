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
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { lightTheme, darkTheme } from './components/Theme';
import AdminProfile from './components/profile/AdminProfile';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
        const newMode = !isDarkMode ? 'dark-mode' : 'light-mode';
        localStorage.setItem('mode', newMode);
    };

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
            <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                <CssBaseline />
                <Navbar
                    isAuthenticated={isAuthenticated}
                    handleLogout={handleLogout}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                />

                {loading && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.77)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                        }}
                    >
                        <CircularProgress size={40} />
                    </Box>
                )}

                {/* Main content: Add padding to ensure content is not hidden */}
                <Box sx={{ marginTop: '64px' }}>
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
                </Box>
            </ThemeProvider>
        </>
    );
}

export default App;
