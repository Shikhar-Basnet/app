import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ isAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('authenticated');
        localStorage.removeItem('role');

        // Call the logout API
        axios.get('http://localhost:5000/logout', { withCredentials: true })
            .then(res => {
                // Redirect to login page after successful logout
                navigate('/login');
            })
            .catch(err => {
                console.error("Logout error:", err);
            });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">App</Link>
                <div className="d-flex">
                    {isAuthenticated ? (
                        <>                            
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-success mx-2">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
