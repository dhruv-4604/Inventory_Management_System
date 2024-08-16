import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Notifications as NotificationsIcon, Add as AddIcon } from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  width: `calc(100% - ${DRAWER_WIDTH}px)`,
  marginLeft: DRAWER_WIDTH,
  backgroundColor: 'white',
  color: 'black',
  boxShadow: 'none',
}));

function TopBar() {
  return (
    <StyledAppBar position="fixed" sx={{borderBottom:"solid 1.5px #E6E4E4"}}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ 
            background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
            boxShadow:'none',
            color: '#232619', 
            ml: 2 
          }}
        >
          Add Shipment
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
}

export default TopBar;