import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [errors, setErrors] = useState({}); // Add errors state to handle form validation
  const [alert, setAlert] = useState({ message: '', type: '' }); // Add alert state for success/error messages
  const [countdown, setCountdown] = useState(3); // State for countdown timer
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

    axios.post('http://localhost:5000/register', values)
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
          setAlert({ message: 'Email already exists, use another email', type: 'danger' });
        }
      })
      .catch(err => {
        setAlert({ message: 'Something went wrong. Please try again.', type: 'danger' });
        console.log(err);
      })
      .finally(() => setLoading(false)); // Hide loader after submission
  };

  // Function to handle closing the alert
  const handleAlertClose = () => {
    setAlert({ message: '', type: '' });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-light p-4 rounded" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center">Sign Up</h2>
        
        {/* Bootstrap Alert */}
        {alert.message && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show p-2 rounded-0`} role="alert" style={{ marginBottom: '15px' }}>
            {alert.message}
            {alert.type === 'success' && countdown > 0 && (
              <span className="ms-2" style={{ fontSize: '0.9rem' }}>
                Redirecting in {countdown}s...
              </span>
            )}
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={handleAlertClose} // Close the alert by updating state
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="name"><strong>Name</strong></label>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={values.name}
              onChange={e => setValues({ ...values, name: e.target.value })}
              className={`form-control rounded-0 ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          <div className="mb-2">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={values.email}
              onChange={e => setValues({ ...values, email: e.target.value })}
              className={`form-control rounded-0 ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="mb-2">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={values.password}
              onChange={e => setValues({ ...values, password: e.target.value })}
              className={`form-control rounded-0 ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" id="terms" name="terms" />
              <label className="form-check-label" htmlFor="terms">
                You agree to our <a href="#">terms and conditions</a>.
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Sign Up"
            )}
          </button>

          <Link to="/login" className="btn btn-link w-100 mt-2">Already have an account?</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
