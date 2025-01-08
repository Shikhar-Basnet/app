import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, role, requiredRole, children }) => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If authenticated but role does not match the requiredRole, redirect to home or error page
    if (role !== requiredRole) {
        return <Navigate to="/" />;
    }

    // If everything is okay, render the children (protected content)
    return children;
};

export default ProtectedRoute;
