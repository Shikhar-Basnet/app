import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/login', values)
            .then(res => {
                if (res.data.Status === "Success") {
                    // Redirect based on role
                    if (res.data.role === 'admin') {
                        navigate('/admin-dashboard');
                    } else if (res.data.role === 'user') {
                        navigate('/user-dashboard');
                    }
                } else {
                    alert(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    };
    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-light p-4 rounded">
                <h2 className="text-center">Log In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            onChange={e => setValues({ ...values, email: e.target.value })}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            onChange={e => setValues({ ...values, password: e.target.value })}
                            className="form-control rounded-0"
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">Log in</button>
                    <Link to="/register" className="btn btn-link w-100 mt-2">Create an account?</Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
