import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Simulating fetching user data
    useEffect(() => {
        // In a real application, you would fetch this data from an API
        const fetchedUser = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            lastLogin: '2025-01-15',
        };
        setUser(fetchedUser);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Welcome to the User Dashboard, {user.name}</h1>

            <div className="card mt-4">
                <div className="card-body">
                    <h5 className="card-title">User Information</h5>
                    <p className="card-text"><strong>Email:</strong> {user.email}</p>
                    <p className="card-text"><strong>Last Login:</strong> {user.lastLogin}</p>
                </div>
            </div>

            <div className="mt-4">
                <h3>Quick Actions</h3>
                <div className="d-flex flex-column">
                    <button 
                        className="btn btn-primary mb-2" 
                        onClick={() => handleNavigation('/profile')}
                    >
                        View Profile
                    </button>
                    <button 
                        className="btn btn-secondary mb-2"
                        onClick={() => handleNavigation('/settings')}
                    >
                        Account Settings
                    </button>
                    <button 
                        className="btn btn-warning mb-2"
                        onClick={() => handleNavigation('/activity')}
                    >
                        View Activity Logs
                    </button>
                    <button 
                        className="btn btn-danger"
                        onClick={() => handleNavigation('/logout')}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
