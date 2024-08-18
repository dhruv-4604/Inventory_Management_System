// Sidebar.js
import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Collapse, 
  TextField, 
  InputAdornment, 
  Avatar, 
  Typography,
  Button
} from '@mui/material';
import { 
  ExpandLess, 
  ExpandMore,
  Search as SearchIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Apps';
import InventoryIcon from '@mui/icons-material/Inventory';
import SalesIcon from '@mui/icons-material/AttachMoney';
import OrdersIcon from '@mui/icons-material/ShoppingCart';
import mainLogo from './logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;

const SidebarItem = ({ icon, text, to, onClick, isExpandable, isExpanded, isSelected }) => (
  <ListItem 
    button 
    component={Link}
    to={to}
    onClick={onClick}
    sx={{
      background: isSelected ? 'linear-gradient(90deg, #D1EA67 , #A6F15A )' : 'transparent',
      color: isSelected ? '#000' : 'inherit',
      '&:hover': {
        backgroundColor: isSelected ? '#9AE6B4' : 'rgba(0, 0, 0, 0.04)',
      },
      borderRadius: '5px',
      margin: '4px 0',
      padding: '8px 16px',
    }}
  >
    <ListItemIcon sx={{ minWidth: '40px', color: isSelected ? '#000' : 'inherit' }}>{icon}</ListItemIcon>
    <ListItemText primary={text} />
    {isExpandable && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
  </ListItem>
);

const ExpandableSidebarItem = ({ items, isExpanded }) => (
  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      <Box sx={{ 
        borderLeft: '1px solid #e0e0e0', 
        ml: 3.4, 
        pl: 2
      }}>
        {items.map((item, index) => (
          <ListItem 
            button 
            component={Link}
            to={item.to}
            key={index} 
            sx={{ 
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              borderRadius: '8px',
              margin: '4px 0',
              padding: '8px 16px',
            }}
          >
            <ListItemText primary={item.text} sx={{ color: '#757575' }} />
          </ListItem>
        ))}
      </Box>
    </List>
  </Collapse>
);

function Sidebar() {
  const [expandedItem, setExpandedItem] = useState('Inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: <DashboardIcon />, text: 'Dashboard', to: '/dashboard' },
    { 
      icon: <InventoryIcon />, 
      text: 'Inventory', 
      isExpandable: true,
      to: '/inventory',
      subItems: [
        { text: 'Manage Items', to: '/inventory/items' },
        { text: 'Categories', to: '/inventory/categories' },
        { text: 'Price List', to: '/inventory/price_list' }
      ]
    },
    { icon: <SalesIcon />, text: 'Sales', to: '/sales', isExpandable: true,
      subItems: [
        { text: 'Customers', to: '/inventory/items' },
        { text: 'Sale Orders', to: '/inventory/categories' },
        { text: 'Shipments', to: '/inventory/price_list' }
      ]},
    { icon: <OrdersIcon />, text: 'Orders', to: '/orders' },
  ];

  const handleItemClick = (itemText) => {
    if (itemText === expandedItem) {
      setExpandedItem(null);
    } else if (sidebarItems.find(item => item.text === itemText)?.isExpandable) {
      setExpandedItem(itemText);
    } else {
      setExpandedItem(null);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/signin');
  };

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: 'solid 1.5px #E6E4E4',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ p: 3, pb:4 }}>
        <img src={mainLogo} alt="Logo" style={{ height: '32px', width: '100%', objectFit: 'contain' }} />
      </Box>

      <Box sx={{ px: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '20px',
              backgroundColor: '#f5f5f5',
              '& fieldset': { border: 'none' },
            }
          }}
        />
      </Box>

      <List sx={{ flexGrow: 1, px: 2 }}>
        {sidebarItems.map((item, index) => (
          <React.Fragment key={index}>
            <SidebarItem
              icon={item.icon}
              text={item.text}
              to={item.to}
              onClick={() => handleItemClick(item.text)}
              isExpandable={item.isExpandable}
              isExpanded={expandedItem === item.text}
              isSelected={location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)}
            />
            {item.isExpandable && (
              <ExpandableSidebarItem 
                items={item.subItems} 
                isExpanded={expandedItem === item.text}
              />
            )}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ 
        mt: 'auto', 
        p: 2, 
        borderTop: '1px solid #E6E4E4',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '8px 16px',
        }}>
          <Avatar src="/path-to-profile-image.jpg" alt="Dhruv Patel" sx={{ width: 40, height: 40, mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Dhruv Patel</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>dhp4604@gmail.com</Typography>
          </Box>
          <Box onClick={handleLogout} sx={{ cursor: 'pointer' }}>
            <LogoutIcon sx={{ color: 'text.secondary' }} />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;