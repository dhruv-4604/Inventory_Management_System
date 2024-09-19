// TopBar.js
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button,
  Box,
  Badge,
  Menu,
  MenuItem,
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
  borderBottom: '1px solid #E6E4E4',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
  },
}));

function TopBar({ title }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New shipment arrived' },
    { id: 2, message: 'Low stock alert: Item XYZ' },
    { id: 3, message: 'Pending order: #12345' },
  ]);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleNewOrderClick = () => {
    navigate('/sales/new_order');
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' , userSelect: 'none',} }>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" sx={{ mr: 2 }} onClick={handleNotificationClick}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon color='#232619'/>
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationClose}
          >
            {notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={handleNotificationClose}>
                {notification.message}
              </MenuItem>
            ))}
          </Menu>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewOrderClick}
            sx={{ 
              background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
              color: '#232619',
              boxShadow:'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
                boxShadow:'none'
              },
              textTransform: 'none',
              fontWeight: 'semibold',
            }}
          >
            New Order
          </Button>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default TopBar;