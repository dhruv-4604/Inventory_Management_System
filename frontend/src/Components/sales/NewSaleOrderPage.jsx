import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel,
  Autocomplete, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Snackbar, CircularProgress
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from "../../api";

const CustomerForm = ({ customers, order, onOrderChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    onOrderChange('customerName', newInputValue);
  };

  return (
    <Box>
      <Autocomplete
        options={customers}
        getOptionLabel={(option) => option.name}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={(event, newValue) => {
          if (newValue) {
            onOrderChange('customerId', newValue.customer_id);
            onOrderChange('customerName', newValue.name);
            onOrderChange('customerEmail', newValue.email);
            onOrderChange('phoneNumber', newValue.phone_number);
            onOrderChange('address', newValue.address);
            onOrderChange('state', newValue.state);
            onOrderChange('city', newValue.city);
            onOrderChange('pincode', newValue.pincode);
          } else {
            onOrderChange('customerId', null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Customer" fullWidth />}
        freeSolo
      />
      <TextField
        fullWidth
        label="Email"
        value={order.customerEmail}
        onChange={(e) => onOrderChange('customerEmail', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Phone Number"
        value={order.phoneNumber}
        onChange={(e) => onOrderChange('phoneNumber', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Address"
        value={order.address}
        onChange={(e) => onOrderChange('address', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="State"
        value={order.state}
        onChange={(e) => onOrderChange('state', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="City"
        value={order.city}
        onChange={(e) => onOrderChange('city', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Pincode"
        value={order.pincode}
        onChange={(e) => onOrderChange('pincode', e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Order Mode</InputLabel>
        <Select
          value={order.orderMode}
          onChange={(e) => onOrderChange('orderMode', e.target.value)}
        >
          <MenuItem value="AT SHOP">At Shop</MenuItem>
          <MenuItem value="DELIVERY">Delivery</MenuItem>
        </Select>
      </FormControl>
      {order.orderMode === 'DELIVERY' && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Courier Partner</InputLabel>
          <Select
            value={order.courierPartner}
            onChange={(e) => onOrderChange('courierPartner', e.target.value)}
          >
            <MenuItem value="FEDEX">FedEx</MenuItem>
            <MenuItem value="UPS">UPS</MenuItem>
            <MenuItem value="USPS">USPS</MenuItem>
            <MenuItem value="DHL">DHL</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

const OrderItemsTable = ({ orderItems, availableItems, onItemChange, onAddItem, onRemoveItem }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="40%">Item</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell width="10%">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Autocomplete
                  options={availableItems}
                  getOptionLabel={(option) => option?.name || ''}
                  value={item.item || null}
                  onChange={(event, newValue) => onItemChange(index, 'item', newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  fullWidth
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 0;
                    const maxQuantity = item.item?.quantity || 0;
                    onItemChange(index, 'quantity', Math.min(newValue, maxQuantity));
                  }}
                  onKeyDown={(e) => {
                    const maxQuantity = item.item?.quantity || 0;
                    const currentValue = e.target.value;
                    const key = e.key;

                    if (
                      key !== 'Backspace' &&
                      key !== 'ArrowLeft' &&
                      key !== 'ArrowRight' &&
                      key !== 'Delete' &&
                      key !== 'Tab'
                    ) {
                      const newValue = currentValue + key;
                      if (parseInt(newValue) > maxQuantity) {
                        e.preventDefault();
                      }
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: item.item?.quantity || 0,
                  }}
                />
              </TableCell>
              <TableCell>
                {item.item && item.item.selling_price !== undefined
                  ? `₹ ${item.item.selling_price}`
                  : '-'}
              </TableCell>
              <TableCell>
                {item.item && item.quantity
                  ? `₹ ${(item.item.selling_price * item.quantity).toFixed(2)}`
                  : '-'}
              </TableCell>
              <TableCell>
                <Button onClick={() => onRemoveItem(index)} size="small">Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onAddItem}>Add Item</Button>
    </TableContainer>
  );
};

const OrderSummary = ({ order, onOrderChange, total }) => {
  const handleDiscountChange = (e) => {
    const newValue = e.target.value;
    if (newValue === '' || (parseFloat(newValue) >= 0 && parseFloat(newValue) <= total)) {
      onOrderChange('discount', newValue === '' ? '' : parseFloat(newValue));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 2 }}>
      <TextField
        label="Discount"
        type="number"
        value={order.discount}
        onChange={handleDiscountChange}
        onBlur={() => {
          if (order.discount === '') {
            onOrderChange('discount', 0);
          }
        }}
        InputProps={{ 
          inputProps: { 
            min: 0,
            max: total,
            step: 0.01
          } 
        }}
        sx={{ width: '200px', mb: 1 }}
      />
      <Typography variant="h6">Total: ₹ {(total - (parseFloat(order.discount) || 0)).toFixed(2)}</Typography>
      <FormControl sx={{ width: '200px', mt: 1 }}>
        <InputLabel>Payment Status</InputLabel>
        <Select
          value={order.paymentStatus}
          onChange={(e) => onOrderChange('paymentStatus', e.target.value)}
        >
          <MenuItem value="Due">Due</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

const NewSaleOrderPage = () => {
  const navigate = useNavigate();
  const [availableItems, setAvailableItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState({
    customerId: null,
    customerName: '',
    customerEmail: '',
    phoneNumber: '',
    orderMode: 'AT SHOP',
    address: '',
    state: '',
    city: '',
    pincode: '',
    courierPartner: '',
    paymentStatus: 'Due',
    discount: 0
  });
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, customersResponse] = await Promise.all([
          api.get('/token/items/'),
          api.get('/customers/')
        ]);
        setAvailableItems(itemsResponse.data);
        setCustomers(customersResponse.data);
        setOrderItems([{ item: null, quantity: 1, amount: 0 }]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleOrderChange = (name, value) => {
    setOrder(prevOrder => ({ ...prevOrder, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setOrderItems(prevItems => {
      const newItems = [...prevItems];
      const oldItem = newItems[index].item;
      newItems[index] = { ...newItems[index], [field]: value };
      
      const item = field === 'item' ? value : newItems[index].item;
      const quantity = field === 'quantity' ? value : newItems[index].quantity;
      
      const price = item && item.selling_price !== undefined ? item.selling_price : 0;
      const calculatedQuantity = quantity !== undefined ? quantity : 0;
      
      newItems[index].amount = price * calculatedQuantity;

      if (field === 'item') {
        setSelectedItems(prev => {
          const updated = new Set(prev);
          if (oldItem) updated.delete(oldItem.item_id);
          if (item) updated.add(item.item_id);
          return updated;
        });
      }
      
      return newItems;
    });
  };

  const addOrderItem = () => {
    setOrderItems(prevItems => [...prevItems, { item: null, quantity: 1, amount: 0 }]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(prevItems => {
      const removedItem = prevItems[index].item;
      const newItems = prevItems.filter((_, i) => i !== index);
      if (removedItem) {
        setSelectedItems(prev => {
          const updated = new Set(prev);
          updated.delete(removedItem.item_id);
          return updated;
        });
      }
      return newItems;
    });
  };

  const calculateTotal = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    return Math.max(subtotal - (parseFloat(order.discount) || 0), 0);
  };

  const isOrderValid = () => {
    return (
      order.customerName &&
      order.customerEmail &&
      order.phoneNumber &&
      orderItems.some(item => item.item && item.quantity > 0)
    );
  };

  const findExistingCustomer = () => {
    return customers.find(c => 
      c.name === order.customerName &&
      c.email === order.customerEmail &&
      c.phone_number === order.phoneNumber
    );
  };

  const handleSaveOrder = async () => {
    if (!isOrderValid()) {
      setSnackbar({
        open: true,
        message: 'Please select a customer and add at least one item.',
        severity: 'error'
      });
      return;
    }

    setLoading(true);

    let customerId = order.customerId;

    if (!customerId) {
      const existingCustomer = findExistingCustomer();
      if (existingCustomer) {
        customerId = existingCustomer.customer_id;
      } else {
        try {
          const newCustomerResponse = await api.post('/customers/', {
            name: order.customerName,
            email: order.customerEmail,
            phone_number: order.phoneNumber,
            address: order.address,
            state: order.state,
            city: order.city,
            pincode: order.pincode
          });
          customerId = newCustomerResponse.data.customer_id;
        } catch (error) {
          console.error('Failed to add new customer:', error);
          setSnackbar({
            open: true,
            message: 'Failed to add new customer. Please try again.',
            severity: 'error'
          });
          setLoading(false);
          return;
        }
      }
    }

    const orderData = {
      customer_id: customerId,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_address: order.address,
      customer_state: order.state,
      customer_city: order.city,
      customer_pincode: order.pincode,
      mode_of_delivery: order.orderMode === 'AT SHOP' ? 'PICKUP' : 'DELIVERY',
      carrier: order.courierPartner || 'OTHER',
      payment: order.paymentStatus === 'Paid',
      items: orderItems.filter(item => item.item && item.quantity).map(({ item, quantity }) => ({
        item_id: item.item_id,
        quantity,
        rate: item.selling_price
      })),
      discount: parseFloat(order.discount) || 0,
      total_amount: calculateTotal()
    };

    try {
      const response = await api.post('/token/saleorders/', orderData);
      console.log('Server response:', response.data);
      setSnackbar({
        open: true,
        message: 'Order saved successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate('/sales/sale_orders'), 2000);
    } catch (error) {
      console.error('Error saving order:', error.response ? error.response.data : error.message);
      setSnackbar({
        open: true,
        message: 'Failed to save order. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>New Sale Order</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <CustomerForm
            customers={customers}
            order={order}
            onOrderChange={handleOrderChange}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <OrderItemsTable
            orderItems={orderItems}
            availableItems={availableItems.filter(item => !selectedItems.has(item.item_id))}
            onItemChange={handleItemChange}
            onAddItem={addOrderItem}
            onRemoveItem={removeOrderItem}
          />
          <OrderSummary
            order={order}
            onOrderChange={handleOrderChange}
            total={calculateTotal()}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleSaveOrder}
          disabled={!isOrderValid() || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Saving...' : 'Save Order'}
        </Button>
      </Box>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default NewSaleOrderPage;