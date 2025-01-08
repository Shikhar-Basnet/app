import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';

// Registering necessary Chart.js components
ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, Legend);

function AdminDashboard() {
    // Line Chart Data (New Registrations)
    const dataLineChart = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'New Registrations',
                data: [65, 59, 80, 81, 56],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Light color for filling under the line
                borderWidth: 2,
                fill: true, // Fill the area under the line
            },
        ],
    };

    // Pie Chart Data (User Status)
    const dataPieChart = {
        labels: ['Active Users', 'Inactive Users'],
        datasets: [
            {
                data: [85, 15],
                backgroundColor: ['#4caf50', '#f44336'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="admin-dashboard">
            {/* Dashboard Content */}
            <div className="container mt-4">
                <h1 className="text-center">Welcome to the Admin Dashboard</h1>
                
                {/* Row with two charts */}
                <div className="row mt-5">
                    {/* Line Chart: New Registrations */}
                    <div className="col-md-6">
                        <div className="card shadow-lg hover-effect">
                            <div className="card-body">
                                <h3 className="text-center">New Registrations</h3>
                                <Line data={dataLineChart} />
                            </div>
                        </div>
                    </div>

                    {/* Pie Chart: User Status */}
                    <div className="col-md-6">
                        <div className="card shadow-lg hover-effect">
                            <div className="card-body">
                                <h3 className="text-center">User Status</h3>
                                <Pie data={dataPieChart} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Content (e.g., total users, active users, etc.) */}
                <div className="row mt-5">
                    <div className="col-md-4">
                        <div className="card shadow-lg hover-effect">
                            <div className="card-body text-center">
                                <h5>Total Users</h5>
                                <h3>1,230</h3>
                                <p>Active and inactive users</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-lg hover-effect">
                            <div className="card-body text-center">
                                <h5>Active Users</h5>
                                <h3>850</h3>
                                <p>Users currently active</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-lg hover-effect">
                            <div className="card-body text-center">
                                <h5>New Registrations</h5>
                                <h3>100</h3>
                                <p>Users who registered recently</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status Section */}
                <div className="row mt-4">
                    <div className="col">
                        <div className="card shadow-lg hover-effect">
                            <div className="card-body text-center">
                                <h5>System Status</h5>
                                <div className="status-indicator">
                                    <span className="status-online"></span> Everything is running smoothly.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
