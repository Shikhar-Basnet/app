import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authenticated');
        localStorage.removeItem('role');
        axios.get('http://localhost:5000/auth/logout', { withCredentials: true })
            .then(res => {
                // Redirect to login page after logout
                navigate('/login');
            })
            .catch(err => console.log(err));
    };
    

    return (
        <div className="container mt-4">
            <h1>Welcome to the User Dashboard</h1>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default UserDashboard;