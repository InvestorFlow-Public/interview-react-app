import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { authService } from '../services/authService';

const navItems = [
  { to: '/notifications', label: 'Notifications', end: true },
  { to: '/notifications/new', label: 'Create', end: false },
];

export default function Layout() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" component="div" sx={{ mr: 3 }}>
            Notification Center
          </Typography>
          <Box component="nav" sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            {navItems.map(({ to, label, end }) => (
              <Button
                key={to}
                component={NavLink}
                to={to}
                end={end}
                color="inherit"
                sx={{ '&.active': { bgcolor: 'rgba(255,255,255,0.15)' } }}
              >
                {label}
              </Button>
            ))}
          </Box>
          <Button
            color="inherit"
            onClick={() => {
              authService.logout();
              navigate('/login', { replace: true });
            }}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
