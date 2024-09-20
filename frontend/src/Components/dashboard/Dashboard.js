import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  LinearProgress,
  Avatar
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SquareIcon from '@mui/icons-material/Square';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptIcon from '@mui/icons-material/Receipt';
import api from '../../api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    api.get('/token/dashboard/')
      .then(response => {
        setDashboardData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the dashboard data!', error);
      });
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const { available, low_stock, out_of_stock } = dashboardData.stock_percentages;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1.5px solid #DBDBDB' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: '#D5F553', width: 32, height: 32, mr: 1, borderRadius:'12px' }}>
                  <CurrencyRupeeIcon fontSize="small" sx={{ color: '#4caf50' }} />
                </Avatar>
                <Typography variant="body2" color="#676766" sx={{ fontFamily: 'ClashGrotesk-Medium', fontSize:'17px' }}>Total Revenue</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight:'700',  mb: 0.5 }}>₹ {dashboardData.total_revenue.toLocaleString()} <Box  sx={{ bgcolor: '#e8f5e9', borderRadius: 1, px: 1, display:'inline-block', lineHeight:'13px' }}>
                  <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>+7.9%</Typography>
                </Box></Typography>  
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">From last weeks</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Shipments */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1.5px solid #DBDBDB' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: '#d7f5a9', width: 32, height: 32, mr: 1 }}>
                  <LocalShippingIcon fontSize="small" sx={{ color: '#4caf50' }} />
                </Avatar>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Pending Shipments</Typography>
              </Box>
              <Box display="flex" alignItems="baseline" mb={0.5}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 1 }}>{dashboardData.pending_shipments} Orders</Typography>
                <Typography variant="caption" color="text.secondary">In Transits</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">14200 shipments this month</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* New Customers */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1.5px solid #DBDBDB' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: '#b2dfdb', width: 32, height: 32, mr: 1 }}>
                  <PersonAddIcon fontSize="small" sx={{ color: '#00796b' }} />
                </Avatar>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>New Customers</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>{dashboardData.new_customers}</Typography>
              <Typography variant="body2" color="text.secondary">Joined this month</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Orders */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1.5px solid #DBDBDB' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: '#ffecb3', width: 32, height: 32, mr: 1 }}>
                  <ReceiptIcon fontSize="small" sx={{ color: '#ffa000' }} />
                </Avatar>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Total Orders</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>{dashboardData.total_orders}</Typography>
              <Typography variant="body2" color="text.secondary">All time orders</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1.5px solid #DBDBDB' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: '#e3f2fd', width: 24, height: 24, mr: 1 }}>
                  <ShoppingCartIcon fontSize="small" sx={{ color: '#2196f3' }} />
                </Avatar>
                <Typography variant="subtitle1">Top Selling Products</Typography>
              </Box>
              {dashboardData.top_selling_products.map((product, index) => (
                <Card key={index} sx={{ mb: 2, boxShadow: 'none', border: '1.5px solid #DBDBDB', borderRadius: 2 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        src={product.image} 
                        variant="square" 
                        sx={{ width: 48, height: 48, mr: 2,borderRadius:'5px' }}
                        alt={product.name}
                      >
                        {!product.image && product.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">Last Month</Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="subtitle2">{product.total_quantity} Orders</Typography>
                      <Typography variant="caption" color="text.secondary">Last Month</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Availability */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1.5px solid #DBDBDB' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: '#e8f5e9', width: 24, height: 24, mr: 1 }}>
                  <InventoryIcon fontSize="small" sx={{ color: '#4caf50' }} />
                </Avatar>
                <Typography variant="subtitle1">Stock Availability</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>{dashboardData.total_stock}</Typography>
              <Typography variant="caption" color="text.secondary">Total Stock</Typography>
              <Box mt={2} mb={1}>
                <LinearProgress 
                  variant="buffer" 
                  value={available} 
                  valueBuffer={available + low_stock}
                  sx={{ 
                    height: 30, 
                    borderRadius: 3,
                    bgcolor: '#E0E0E0',
                    '& .MuiLinearProgress-dashed': {
                      display: 'none',
                    },
                    '& .MuiLinearProgress-bar1Buffer': {
                      bgcolor: '#D5F553',
                    },
                    '& .MuiLinearProgress-bar2Buffer': {
                      bgcolor: '#FC7900',
                    }
                  }} 
                />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{textAlign:'center'}}>
                <Typography variant="caption" sx={{ color: '#585858', display: 'flex', alignItems: 'center' }}>
                  <SquareIcon sx={{ color: '#D5F553', width: '20px', marginRight:'5px',marginTop:'-2.4px' }} />
                  Available ({available.toFixed(1)}%)
                </Typography>
                <Typography variant="caption" sx={{ color: '#585858', display: 'flex', alignItems: 'center' }}>
                  <SquareIcon sx={{ color: '#FC7900', width: '20px', marginRight:'5px',marginTop:'-2.4px'  }} /> 
                  Low Stock ({low_stock.toFixed(1)}%)
                </Typography>
                <Typography variant="caption" sx={{ color: '#585858', display: 'flex', alignItems: 'center' }}>
                  <SquareIcon sx={{ color: '#E0E0E0', width: '20px', marginRight:'5px',marginTop:'-2.4px'  }} /> 
                  Out Of Stock ({out_of_stock.toFixed(1)}%)
                </Typography>
              </Box>
              <br></br>
              <Typography variant="subtitle2" gutterBottom>Low Stock</Typography>
              {dashboardData.low_stock_items.map((item, index) => (
                <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.brand}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#ff9800' }}>{item.quantity}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;