import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { lightTheme, darkTheme } from './components/Theme';
import Navbar from './components/Navbar';
import { useAuthContext } from './context/AuthContext'; // Create a Context to manage auth state

const Home = lazy(() => import('./components/Home'));
const Register = lazy(() => import('./components/auth/Register'));
const Login = lazy(() => import('./components/auth/Login'));
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const UserDashboard = lazy(() => import('./components/Dashboard/UserDashboard'));
const AdminProfile = lazy(() => import('./components/Profile/AdminProfile'));
const ProtectedRoute = lazy(() => import('./routes/ProtectedRoute'));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Initially set to null to check system preference
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated, role, setAuthData } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Dark Mode Toggle
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    localStorage.setItem('mode', !isDarkMode ? 'dark-mode' : 'light-mode');
  };

  // Check auth status when app is first loaded
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get('http://localhost:5000', { withCredentials: true });
  
        if (res.data.Status === 'Success') {
          // Only update the auth data if the status has changed
          if (!isAuthenticated) {
            setAuthData({ isAuthenticated: true, role: res.data.role });
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('role', res.data.role);
  
            // Redirect based on role, if needed
            if (res.data.role === 'admin') {
              if (location.pathname !== '/admin-dashboard' && location.pathname !== '/admin-profile') {
                navigate('/admin-dashboard');
              }
            } else if (res.data.role === 'user') {
              if (location.pathname !== '/user-dashboard') {
                navigate('/user-dashboard');
              }
            }
          }
        } else {
          // Auth check failed, clear localStorage and set state
          if (isAuthenticated) {
            setAuthData({ isAuthenticated: false, role: null });
            localStorage.setItem('authenticated', 'false');
            
            // Only redirect to login if the user is on a protected route
            if (
              location.pathname !== '/login' &&
              location.pathname !== '/register' &&
              location.pathname !== '/' // Home page
            ) {
              navigate('/login');
            }
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
        if (isAuthenticated) {
          setAuthData({ isAuthenticated: false, role: null });
          localStorage.setItem('authenticated', 'false');
          
          // Only redirect to login if the user is on a protected route
          if (
            location.pathname !== '/login' &&
            location.pathname !== '/register' &&
            location.pathname !== '/' // Home page
          ) {
            navigate('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    };
  
    // Only call checkAuthStatus when the app loads or when the authentication status changes
    if (!isAuthenticated) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, location.pathname, navigate, setAuthData]);

  // Check for the stored theme in localStorage, and fall back to system preference if not set
  useEffect(() => {
    const savedTheme = localStorage.getItem('mode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark-mode');
    } else {
      // System theme preference as fallback
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDarkMode);
    }
  }, []);

  return (
    <ThemeProvider theme={isDarkMode === null ? lightTheme : isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Navbar
        isAuthenticated={isAuthenticated}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Loading Screen */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
          </Box>
        }
      >
        <Box sx={{paddingTop: '64px'}}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
        </Box>
      </Suspense>
    </ThemeProvider>
  );
}
export default App;
