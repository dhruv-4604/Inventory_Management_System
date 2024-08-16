import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TopBar from './TopBar';
import Sidebar from './SideBar';
import MainContent from './MainContent';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar />
        <Sidebar />
        <MainContent />
      </Box>
    </ThemeProvider>
  );
}

export default App;