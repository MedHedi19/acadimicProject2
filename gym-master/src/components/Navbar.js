import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stack, Button } from '@mui/material';

import Logo from '../assets/images/Logo.png';

const Navbar = () => {
  const location = useLocation();

  return (
    <Stack
      direction="row"
      justifyContent="space-between" // Align items at both ends
      sx={{
        gap: { sm: '123px', xs: '40px' },
        mt: { sm: '32px', xs: '20px' },
        px: '20px',
        alignItems: 'center',
      }}
    >
      {/* Left side with the logo and links */}
      <Stack direction="row" alignItems="center" gap="20px">
        <Link to="/">
          <img src={Logo} alt="logo" style={{ width: '48px', height: '48px' }} />
        </Link>
        <Stack direction="row" gap="40px" fontFamily="Alegreya" fontSize="24px" alignItems="flex-end">
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#3A1212',
              borderBottom: location.pathname === '/' ? '3px solid #3e4def' : 'none',
            }}
          >
            Home
          </Link>
          <a
            href="#exercises"
            style={{
              textDecoration: 'none',
              color: '#3A1212',
              borderBottom: location.pathname.includes('/exercise') ? '3px solid #3e4def' : 'none',
            }}
          >
            Exercises
          </a>
          <Link
            to="/services"
            style={{
              textDecoration: 'none',
              color: '#3A1212',
              borderBottom: location.pathname === '/services' ? '3px solid #3e4def' : 'none',
            }}
          >
            Services
          </Link>
        </Stack>
      </Stack>

      {/* Right side with the login button */}
      <Button
        component={Link}
        to="/login"
        variant="contained"
        color="primary"
        sx={{
          zIndex: '2',
          borderRadius: '20px',
          padding: '8px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          textDecoration: 'none',
        }}
      >
        Login
      </Button>
    </Stack>
  );
};

export default Navbar;
