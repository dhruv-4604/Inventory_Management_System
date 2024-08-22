import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './Components/TopBar';
import Sidebar from './Components/SideBar';
import './fonts.css';

const theme = createTheme({
  typography: {
    fontFamily: [
      'ClashGrotesk-Medium',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
});

const DRAWER_WIDTH = 260;

function Main() {
  const location = useLocation();

  // Function to get the title based on the current route
  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/inventory')) return 'Inventory';
    if (path.includes('/sales')) return 'Sales';
    // Add more conditions for other routes as needed
    return 'SupplySync'; // Default title
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar title={getTitle()} />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
           
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
           
            mt: ['56px', '64px'], // Adjust based on AppBar height
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Main;