import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  console.log('Navbar component rendered');
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Tempo Job-Platform
        </Typography>
        <Button color="inherit" component={Link} to="/login">Login</Button>
        <Button color="inherit" component={Link} to="/register">Register</Button>
        <Button color="inherit" component={Link} to="/jobs">Jobs</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;