import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-light p-4 rounded">
                <h1 className="text-center">Welcome to the App</h1>
                <p className="text-center">Please login or register to continue.</p>
                <div className="d-flex justify-content-around mt-3">
                    <Link to="/login" className="btn btn-success">Login</Link>
                    <Link to="/register" className="btn btn-primary">Register</Link>
                </div>
            </div>
        </div>
    );
}
export default Home;
