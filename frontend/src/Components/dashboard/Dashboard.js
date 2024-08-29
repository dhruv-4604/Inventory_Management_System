import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

function DashboardWidget({ icon, title, value, color }) {
  return (
    <StyledPaper>
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Typography variant="h4">{value}</Typography>
    </StyledPaper>
  );
}

function RecentOrdersList() {
  const orders = [
    { id: '1', customer: 'John Doe', amount: '$150', status: 'Delivered' },
    { id: '2', customer: 'Jane Smith', amount: '$250', status: 'Processing' },
    { id: '3', customer: 'Bob Johnson', amount: '$100', status: 'Shipped' },
  ];

  return (
    <List>
      {orders.map((order) => (
        <ListItem key={order.id} divider>
          <ListItemAvatar>
            <Avatar>
              <ShoppingCartIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText 
            primary={order.customer} 
            secondary={`Amount: ${order.amount} - Status: ${order.status}`} 
          />
        </ListItem>
      ))}
    </List>
  );
}

function InventoryStatus() {
  const items = [
    { name: 'Product A', stock: 70 },
    { name: 'Product B', stock: 30 },
    { name: 'Product C', stock: 50 },
  ];

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.name}>
          <ListItemText 
            primary={item.name} 
            secondary={
              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress variant="determinate" value={item.stock} />
                </Box>
                <Box minWidth={35}>
                  <Typography variant="body2" color="textSecondary">{`${item.stock}%`}</Typography>
                </Box>
              </Box>
            } 
          />
        </ListItem>
      ))}
    </List>
  );
}

function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DashboardWidget 
            icon={<ShoppingCartIcon />}
            title="Total Orders" 
            value="150" 
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardWidget 
            icon={<AttachMoneyIcon />}
            title="Revenue" 
            value="$15,000" 
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardWidget 
            icon={<LocalShippingIcon />}
            title="Pending Shipments" 
            value="25" 
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>Recent Orders</Typography>
            <RecentOrdersList />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>Inventory Status</Typography>
            <InventoryStatus />
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;