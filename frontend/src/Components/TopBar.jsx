import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Badge,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Notifications as NotificationsIcon, 
  Add as AddIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  width: `calc(100% - ${DRAWER_WIDTH}px)`,
  marginLeft: DRAWER_WIDTH,
  backgroundColor: 'white',
  color: 'black',
  boxShadow: 'none',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
  },
}));

function TopBar({ title, notificationCount = 0 }) {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    // Handle notification click
    console.log('Notifications clicked');
  };

  const handleAddShipment = () => {
    // Navigate to add shipment page or open modal
    navigate('/add-shipment');
  };

  return (
    <StyledAppBar position="fixed" sx={{borderBottom:"solid 1.5px #E6E4E4"}}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="inherit" 
            onClick={handleNotificationClick}
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddShipment}
            sx={{ 
              background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
              boxShadow:'none',
              color: '#232619', 
              '&:hover': {
                background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
                boxShadow: 'none',
              },
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