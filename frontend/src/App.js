import React from 'react';
import mainlogo from '../public/logo.png'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Button, 
  TextField,
  Box,
  CssBaseline,
  Collapse,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import SalesIcon from '@mui/icons-material/AttachMoney';
import OrdersIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: 'white',
  color: 'black',
}));

function App() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed">
        <Toolbar>
         <Image src={mainlogo} > </Image>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#d4ff54', color: 'black', ml: 2 }}
          >
            Add Shipment
          </Button>
          {/* Add your logo here */}
         
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            SupplySync
          </Typography>
        </Toolbar>
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          sx={{ m: 2 }}
        />
        <List>
          {['Dashboard', 'Inventory', 'Sales'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index === 0 ? <DashboardIcon /> : 
                 index === 1 ? <InventoryIcon /> : <SalesIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <OrdersIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText primary="Manage Items" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText primary="Manage Category" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText primary="Update Products" />
              </ListItem>
            </List>
          </Collapse>
        </List>
        <Box sx={{ mt: 'auto', mb: 2, mx: 2 }}>
          <ListItem>
            <ListItemIcon>
              <Avatar alt="Dhruv Patel" src="/path-to-your-profile-picture.jpg" />
            </ListItemIcon>
            <ListItemText primary="Dhruv Patel" secondary="dhruv4804@gmail.com" />
          </ListItem>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            fullWidth
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
      <Main open={true}>
        <Toolbar />
        <Typography paragraph>
          Main content goes here
        </Typography>
      </Main>
    </Box>
  );
}

export default App;