import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Grid,
    CircularProgress,
    Alert // Import Alert component from MUI
} from '@mui/material';

const Login = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const [error, setError] = useState(''); // State for handling error messages
    const [formErrors, setFormErrors] = useState({ email: '', password: '' }); // State for form validation errors
    const { setAuthData } = useAuthContext();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    // Check if the user is already authenticated when the component mounts
    useEffect(() => {
        const authenticated = localStorage.getItem('authenticated');
        const role = localStorage.getItem('role');

        if (authenticated === 'true' && role) {
            // Redirect based on the stored role
            if (role === 'admin') {
                navigate('/admin-dashboard');
            } else if (role === 'user') {
                navigate('/user-dashboard');
            }
        }
    }, [navigate]);

    // Form validation function
    const validateForm = () => {
        let isValid = true;
        const errors = { email: '', password: '' };

        // Validate email (basic format check)
        if (!values.email) {
            errors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Please enter a valid email.';
            isValid = false;
        }

        // Validate password (minimum length check)
        if (!values.password) {
            errors.password = 'Password is required.';
            isValid = false;
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate the form
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        axios.post('http://localhost:5000/auth/login', values, { withCredentials: true })
            .then((res) => {
                setIsLoading(false);
                if (res.data.Status === 'Success') {
                    // Update auth context and redirect
                    setAuthData({ isAuthenticated: true, role: res.data.role });
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('authenticated', 'true');
                    navigate(res.data.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
                } else {
                    setError(res.data.Error || 'An error occurred. Please try again.');
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                setIsLoading(false);
                if (err.response) {
                    setError(err.response.data.Error || 'Server error occurred. Please try again.');
                } else if (err.request) {
                    setError('No response from the server. Please check your connection.');
                } else {
                    setError('An unexpected error occurred. Please try again.');
                }
            });
    };

    return (
        <Box
            maxWidth="xs"
            sx={{
                px: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Paper
                elevation={1}
                sx={{
                    padding: 5,
                    borderRadius: 2,
                    width: '100%',
                    maxWidth: 420
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Log In
                </Typography>
                {/* Display error inside an Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            name="email"
                            variant="outlined"
                            value={values.email}
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            required
                            error={Boolean(formErrors.email)} // Display error if there is an email error
                            helperText={formErrors.email} // Show the email error message
                        />
                    </Box>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            name="password"
                            variant="outlined"
                            value={values.password}
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            required
                            error={Boolean(formErrors.password)} // Display error if there is a password error
                            helperText={formErrors.password} // Show the password error message
                        />
                    </Box>
                    <Button
                        type="submit"
                        size="large"
                        fullWidth
                        variant="contained"
                        color="success"
                        sx={{ mb: 2 }}
                        disabled={isLoading} // Disable button when loading
                        startIcon={isLoading ? <CircularProgress size={22} color="success" /> : null} // Show spinner
                    >
                        {isLoading ? '' : 'Log In'}
                    </Button>
                    <Link to="/register" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
                        Create an account?
                    </Link>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;
