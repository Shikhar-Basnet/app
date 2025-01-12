import React from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Button, Drawer, useMediaQuery, Link as MuiLink
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import Logout from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomSwitch from './CustomSwitch';

const Navbar = ({ isDarkMode, toggleDarkMode, isAuthenticated }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authenticated');
        axios
            .get('http://localhost:5000/auth/logout', { withCredentials: true })
            .then(() => navigate('/login'))
            .catch((err) => console.error('Logout error:', err));
        setSidebarOpen(false);
    };

    const handleLinkClick = (path) => {
        // Prevent navigation to home for authenticated users
        if (isAuthenticated && path === '/') {
            return;
        }
        navigate(path);
        setSidebarOpen(false);
    };

    const renderLinks = () => {
        const links = [];

        // Add Home link only for unauthenticated users or after logout
        if (!isAuthenticated) {
            links.push({ label: 'Home', path: '/' });
        }

        // Add Profile link only for authenticated users
        if (isAuthenticated) {
            links.push({ label: 'Profile', path: '/admin-profile' });
        }

        // Add Login/Register for unauthenticated users
        if (!isAuthenticated) {
            links.push({ label: 'Login', path: '/login' });
            links.push({ label: 'Register', path: '/register' });
        }

        // Add Logout for authenticated users
        if (isAuthenticated) {
            links.push({ label: 'Logout', path: '/', action: handleLogout });
        }

        return links.map((link, index) => (
            <Button
                key={index}
                fullWidth
                onClick={link.action || (() => handleLinkClick(link.path))}
                color="default"
                sx={{ justifyContent: 'flex-start', paddingLeft: 2 }}
            >
                {link.label === 'Home' && <HomeIcon sx={{ marginRight: 1 }} />}
                {link.label === 'Profile' && <AccountCircle sx={{ marginRight: 1 }} />}
                {link.label === 'Logout' && <Logout sx={{ marginRight: 1 }} />}
                {link.label}
            </Button>
        ));
    };

    return (
        <AppBar position="fixed" sx={{ minHeight: 60, justifyContent: 'center' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Left Section */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isSmallScreen && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => setSidebarOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h5" component="div">
                        <MuiLink href="/" color="inherit" underline="none" sx={{ fontWeight: 'bold' }}>
                            Shikhar.
                        </MuiLink>
                    </Typography>
                </div>

                {/* Center Section */}
                {!isSmallScreen && (
                    <div style={{ display: 'flex', justifyContent: 'center', flexGrow: 1, gap: '20px' }}>
                        {!isAuthenticated && (
                            <MuiLink onClick={() => handleLinkClick('/')} color="inherit" underline="none">
                                Home
                            </MuiLink>
                        )}
                        {isAuthenticated && (
                            <MuiLink onClick={() => handleLinkClick('/admin-profile')} color="inherit" underline="none">
                                Profile
                            </MuiLink>
                        )}
                    </div>
                )}

                {/* Right Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {!isSmallScreen && isAuthenticated ? (
                        <Button color="error" variant="contained" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        !isSmallScreen && (
                            <>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    component={Link}
                                    to="/login"
                                >
                                    Login
                                </Button>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    component={Link}
                                    to="/register"
                                >
                                    Register
                                </Button>
                            </>
                        )
                    )}
                    <CustomSwitch checked={isDarkMode} onChange={toggleDarkMode} />
                </div>
            </Toolbar>

            {/* Sidebar for Small Screens */}
            <Drawer
                anchor="left"
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)} // Close the drawer on overlay click
            >
                <div style={{ width: 240, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{
                        backgroundColor: theme.palette.primary.dark, display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center', padding: 10
                    }}>
                        <Typography variant='h6' color='white' fontWeight='bold'>Shikhar</Typography>
                        <IconButton
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                color: 'white', // Make the icon white to contrast with the blue background
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>

                    {/* Render dynamic buttons for links */}
                    <div style={{ flexGrow: 1 }}>
                        {renderLinks()}
                    </div>
                </div>
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
