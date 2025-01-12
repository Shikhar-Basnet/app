import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Grid, Paper, Container } from '@mui/material';

function Home() {
    return (
        <Container maxWidth="sm">
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
            >
                <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to the App
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Please login or register to continue.
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="success" 
                                component={Link} 
                                to="/login"
                                fullWidth
                            >
                                Login
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                component={Link} 
                                to="/register"
                                fullWidth
                            >
                                Register
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
}

export default Home;
