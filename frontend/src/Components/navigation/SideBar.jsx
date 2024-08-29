// Sidebar.js
import React, { useState, useEffect } from 'react';
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Collapse, 
  TextField, InputAdornment, Avatar, Typography
} from '@mui/material';
import { 
  ExpandLess, ExpandMore, Search as SearchIcon, Logout as LogoutIcon
} from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Apps';
import InventoryIcon from '@mui/icons-material/Inventory';
import SalesIcon from '@mui/icons-material/AttachMoney';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import mainLogo from '../../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';

const DRAWER_WIDTH = 260;

// Component for individual sidebar items
const SidebarItem = ({ icon, text, to, onClick, isExpandable, isExpanded, isSelected, isChildSelected }) => (
  <ListItem 
    button 
    component={Link}
    to={to}
    onClick={onClick}
    sx={{
      background: (isSelected || isChildSelected)
        ? 'linear-gradient(90deg, #D1EA67 , #A6F15A )'
        : 'transparent',
      color: (isSelected || isChildSelected) ? '#000' : 'inherit',
      '&:hover': {
        backgroundColor: (isSelected || isChildSelected) 
          ? 'linear-gradient(90deg, #D1EA67 , #A6F15A )'
          : 'rgba(0, 0, 0, 0.04)',
      },
      borderRadius: '5px',
      margin: '4px 0',
      padding: '8px 16px',
      fontWeight: (isSelected || isChildSelected) ? 'bold' : 'normal',
    }}
  >
    <ListItemIcon sx={{ minWidth: '40px', color: (isSelected || isChildSelected) ? '#000' : 'inherit' }}>
      {icon}
    </ListItemIcon>
    <ListItemText primary={text} />
    {isExpandable && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
  </ListItem>
);

// Component for expandable sidebar items (sub-menu)
const ExpandableSidebarItem = ({ items, isExpanded, parentTo, selectedChildTo }) => (
  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      <Box sx={{ 
        borderLeft: '1.6px solid #e0e0e0', 
        ml: 3.4, 
        pl: 2
      }}>
        {items.map((item, index) => (
          <ListItem 
            button 
            component={Link}
            to={`${parentTo}/${item.to}`}
            key={index} 
            sx={{ 
              backgroundColor: selectedChildTo === item.to ? 'rgba(0, 0, 0, 0.14)' : 'transparent',
              '&:hover': {
                backgroundColor: selectedChildTo === item.to ? '#F0F0F0' : 'rgba(0, 0, 0, 0.04)',
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

  const [name,setName]=useState("")
  const [email,setEmail]=useState("")

  useEffect( () => { async function fetchData(){
    try {
      const res = await api.get('/token/user/')
 
        setName(res.data.company_name)
        setEmail(res.data.email)
        console.log(res.data)
       
      
  } catch (error) {
      alert(error)
  }
}fetchData()
}, []);


  

   


  
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Define sidebar items
  const sidebarItems = [
    { icon: <DashboardIcon />, text: 'Dashboard', to: '/dashboard' },
    { 
      icon: <InventoryIcon />, 
      text: 'Inventory', 
      isExpandable: true,
      to: '/inventory',
      subItems: [
        { text: 'Items', to: 'items' },
        { text: 'Categories', to: 'categories' },
        { text: 'Price List', to: 'price_list' }
      ]
    },
    { icon: <SalesIcon />, text: 'Sales', isExpandable: true, to: '/sales', subItems: [
      { text: 'Customers', to: 'customerpage' },
      { text: 'Sale Orders', to: 'sale_orders' },
      { text: 'Shipments', to: 'Shipments' }
    ]},
    { icon: <StoreIcon />, text: 'Purchases', isExpandable: true, to: '/Purchases',subItems: [
      { text: 'Vendors', to: 'vendors' },
      { text: 'Purchase Orders', to: 'Purchase_Orders' }
    ] },
    { icon: <SettingsIcon />, text: 'Settings', to: '/Settings' },
  ];

  // Effect to expand the correct item based on the current route
  useEffect(() => {
    const currentPath = location.pathname;
    const expandableItem = sidebarItems.find(item => 
      item.isExpandable && item.subItems.some(subItem => currentPath.includes(`${item.to}/${subItem.to}`))
    );
    if (expandableItem) {
      setExpandedItem(expandableItem.text);
    }
  }, [location.pathname]);

  // Handle click on sidebar item
  const handleItemClick = (itemText) => {
    const item = sidebarItems.find(item => item.text === itemText);
    if (item && item.isExpandable) {
      setExpandedItem(expandedItem === itemText ? null : itemText);
    } else {
      setExpandedItem(null);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear()
    navigate('/signin');
  };

  // Get the selected child item
  const getSelectedChildTo = (item) => {
    if (item.isExpandable) {
      const selectedSubItem = item.subItems.find(subItem => 
        location.pathname.includes(`${item.to}/${subItem.to}`)
      );
      return selectedSubItem ? selectedSubItem.to : null;
    }
    return null;
  };

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: 'solid 1px #E6E4E4',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#FFFFF',

        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Logo */}
      <Box sx={{ p: 3, pb: 4 }}>
        <img src={mainLogo} alt="Logo" style={{ height: '32px', width: '100%', objectFit: 'contain' }} />
      </Box>

      {/* Search bar */}
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
              borderRadius: '8px',
              backgroundColor: '#f5f5f5',
              '& fieldset': { border: 'none' },
            }
          }}
        />
      </Box>

      {/* Sidebar menu items */}
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
              isSelected={location.pathname === item.to}
              isChildSelected={item.isExpandable && item.subItems.some(subItem => 
                location.pathname.includes(`${item.to}/${subItem.to}`))}
            />
            {item.isExpandable && (
              <ExpandableSidebarItem 
                items={item.subItems} 
                isExpanded={expandedItem === item.text}
                parentTo={item.to}
                selectedChildTo={getSelectedChildTo(item)}
              />
            )}
          </React.Fragment>
        ))}
      </List>

      {/* User profile and logout */}
      <Box sx={{ 
        mt: 'auto', 
        p: 2,
       
      }}>
        <Box sx={{ 
         
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#FFFFF',
          borderRadius: '8px',
          padding: '8px 16px',
          paddingRight:'12px',
          border: '1.4px solid #AEAEAE',
        }}>
          <Avatar src="/path-to-profile-image.jpg" alt="Dhruv Patel" sx={{ width: 40, height: 40, mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography pb="-2px" variant="subtitle2" sx={{ fontWeight: 'semibold', fontSize:"17px" }}>{name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize:"11px"}}>{email}</Typography>
          </Box>
          <Box   ml='10px' mt="7px" onClick={handleLogout} sx={{ cursor: 'pointer' }}>
            <LogoutIcon  sx={{ color: 'text.secondary' }} />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;