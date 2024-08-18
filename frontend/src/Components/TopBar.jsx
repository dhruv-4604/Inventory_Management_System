// TopBar.js
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Notifications as NotificationsIcon, 
  Add as AddIcon 
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  width: `calc(100% - ${DRAWER_WIDTH}px)`,
  marginLeft: DRAWER_WIDTH,
  backgroundColor: 'white',
  color: 'black',
  boxShadow: 'none',
  borderBottom: '1px solid #E6E4E4',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
  },
}));

function TopBar({ title }) {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' , userSelect: 'none',} }>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <NotificationsIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ 
              background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
              color: '#232619',
              '&:hover': {
                background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
              },
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Add Shipment
          </Button>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default TopBar;