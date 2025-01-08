import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Grid,
    CircularProgress
} from '@mui/material';

const Login = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const [error, setError] = useState(''); // State for handling error messages
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

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true); // Set loading to true
        setError(''); // Reset any previous errors

        axios.post('http://localhost:5000/login', values, { withCredentials: true })
            .then((res) => {
                setIsLoading(false); // Set loading to false once response is received
                if (res.data.Status === "Success") {
                    // Store role and auth status in localStorage
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('authenticated', 'true');

                    // Redirect based on role
                    if (res.data.role === 'admin') {
                        navigate('/admin-dashboard');
                    } else if (res.data.role === 'user') {
                        navigate('/user-dashboard');
                    }
                } else {
                    setError(res.data.Error || 'An error occurred. Please try again.');
                }
            })
            .catch((err) => {
                setIsLoading(false); // Set loading to false if there's an error
                console.log(err);
                setError('An error occurred. Please try again later.');
            });
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Paper 
                elevation={3} 
                sx={{ 
                    padding: 5, 
                    borderRadius: 2, 
                    width: '100%', 
                    maxWidth: 480 
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Log In
                </Typography>
                {error && <Typography color="error" variant="body2" align="center" mb={2}>{error}</Typography>}
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
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null} // Show spinner
                    >
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <Button color="primary" variant="text">
                                    Create an account?
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
