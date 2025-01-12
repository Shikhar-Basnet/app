import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, TextField, Button, CircularProgress, Alert } from '@mui/material';

const Register = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [errors, setErrors] = useState({}); // Add errors state to handle form validation
  const [alert, setAlert] = useState({ message: '', type: '' }); // Add alert state for success/error messages
  const [countdown, setCountdown] = useState(5); // State for countdown timer
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Disable button after success
  const navigate = useNavigate();

  // Simple form validation function
  const validateForm = () => {
    let formErrors = {};
    if (!values.name) formErrors.name = 'Name is required';
    if (!values.email) formErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) formErrors.email = 'Email is invalid';
    if (!values.password) formErrors.password = 'Password is required';
    else if (values.password.length < 6) formErrors.password = 'Password must be at least 6 characters long';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return; // Prevent submission if validation fails

    setLoading(true); // Show loader while submitting the form
    setAlert({ message: '', type: '' }); // Reset alert message before submitting
    setIsButtonDisabled(true); // Disable the button immediately after submission starts

    axios.post('http://localhost:5000/auth/register', values)
      .then(res => {
        if (res.data.Status === "Success") {
          setAlert({ message: 'Registration Success! Redirecting to login...', type: 'success' });
          // Start the countdown to navigate to login
          let countdownTimer = setInterval(() => {
            setCountdown(prevCountdown => {
              if (prevCountdown <= 1) {
                clearInterval(countdownTimer);
                navigate('/login');
              }
              return prevCountdown - 1;
            });
          }, 1000);
        } else {
          setAlert({ message: 'Email already exists, use another email', type: 'error' });
        }
      })
      .catch(err => {
        setAlert({ message: 'Something went wrong. Please try again.', type: 'error' });
        console.log(err);
      })
      .finally(() => setLoading(false)); // Hide loader after submission
  };

  // Function to handle closing the alert
  const handleAlertClose = () => {
    setAlert({ message: '', type: '' });
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
        <h2 className="text-center">Sign Up</h2>

        {/* Material UI Alert */}
        {alert.message && (
          <Alert
            severity={alert.type}
            onClose={handleAlertClose}
            sx={{ marginBottom: 2 }}
          >
            {alert.message}
            {alert.type === 'success' && countdown > 0 && (
              <span style={{ fontSize: '0.9rem' }}>
                Redirecting in {countdown}s...
              </span>
            )}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={values.name}
            onChange={e => setValues({ ...values, name: e.target.value })}
            variant="outlined"
            fullWidth
            margin="normal"
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <TextField
            label="Email"
            name="email"
            value={values.email}
            onChange={e => setValues({ ...values, email: e.target.value })}
            variant="outlined"
            fullWidth
            margin="normal"
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={e => setValues({ ...values, password: e.target.value })}
            variant="outlined"
            fullWidth
            margin="normal"
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loading || isButtonDisabled} // Disable button during loading or after success
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>

          <Link to="/login" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
            Already have an account? Log in
          </Link>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
