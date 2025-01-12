import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';
import axios from 'axios';
import {
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';

// Registering necessary Chart.js components
ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, Legend);

function AdminDashboard() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [newRegistrations, setNewRegistrations] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch message and stats from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsResponse = await axios.get('http://localhost:5000/admin/stats', { withCredentials: true });
                if (statsResponse.data.Status === 'Success') {
                    setTotalUsers(statsResponse.data.totalUsers);
                    setActiveUsers(statsResponse.data.activeUsers);
                    setNewRegistrations(statsResponse.data.newRegistrations);
                    setName(statsResponse.data.name);
                    setRole(statsResponse.data.role);
                }
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    // Line Chart Data (New Registrations)
    const dataLineChart = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'New Registrations',
                data: [65, 59, 80, 81, 56, 33, 48, 77], // Update this with real data
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light color for filling under the line
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
                data: [activeUsers, totalUsers - activeUsers], // Dynamically update the pie chart
                backgroundColor: ['#4caf50', '#f44336'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <Box p={3}>
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant="h5" align="center" gutterBottom>
                        {name && role ? `Welcome to ${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()} Dashboard, ${name}!` : 'Loading...'}
                    </Typography>



                    {/* Charts Section */}
                    <Grid container spacing={3} mt={3}>
                        {/* Line Chart */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6" align="center" gutterBottom>
                                    New Registrations
                                </Typography>
                                <Line data={dataLineChart} />
                            </Paper>
                        </Grid>

                        {/* Pie Chart */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6" align="center" gutterBottom>
                                    User Status
                                </Typography>
                                <Pie data={dataPieChart} />
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Statistics Section */}
                    <Grid container spacing={3} mt={3}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                <Typography variant="subtitle1">Total Users</Typography>
                                <Typography variant="h4">{totalUsers}</Typography>
                                <Typography variant="body2">Active and inactive users</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                <Typography variant="subtitle1">Active Users</Typography>
                                <Typography variant="h4">{activeUsers}</Typography>
                                <Typography variant="body2">Users currently active</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                <Typography variant="subtitle1">New Registrations</Typography>
                                <Typography variant="h4">{newRegistrations}</Typography>
                                <Typography variant="body2">Users who registered recently</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* System Status Section */}
                    <Grid container spacing={3} mt={3}>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                <Typography variant="subtitle1">System Status</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Everything is running smoothly.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
}

export default AdminDashboard;
