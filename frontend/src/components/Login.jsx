import React from 'react';
import {Link} from 'react-router-dom';

const Login = () => {
    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-light p-4 rounded">
                <h2 className="text-center">Log In</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="Enter your email" name="email"
                            className="form-control rounded-0" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            className="form-control rounded-0"
                        />
                        <div className="form-check mt-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="terms"
                                name="terms"
                            />
                            <label className="form-check-label" htmlFor="terms">
                                You agree to our <a href="#">terms and conditions</a>.
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">Log in</button>
                    <Link to="/register" className="btn btn-link w-100 mt-2">Create an account?</Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
