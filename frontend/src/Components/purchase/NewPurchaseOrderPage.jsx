import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel,
  Autocomplete, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import api from "../../api";

const VendorForm = ({ vendors, order, onOrderChange }) => {
  return (
    <Box>
      <Autocomplete
        options={vendors}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          onOrderChange('vendor_id', newValue?.vendor_id || 0);
          onOrderChange('vendor_name', newValue?.name || '');
          onOrderChange('vendor_address', newValue?.address || '');
          onOrderChange('vendor_phone', newValue?.phone_number || '');
        }}
        renderInput={(params) => <TextField {...params} label="Vendor" fullWidth />}
      />
      <TextField
        fullWidth
        label="Vendor Address"
        value={order.vendor_address}
        onChange={(e) => onOrderChange('vendor_address', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Vendor Phone"
        value={order.vendor_phone}
        onChange={(e) => onOrderChange('vendor_phone', e.target.value)}
        margin="normal"
      />
    </Box>
  );
};

const OrderItemsTable = ({ orderItems, availableItems, onItemChange, onAddItem, onRemoveItem }) => {
  // Filter out items that are already in the order
  const remainingItems = availableItems.filter(item => 
    !orderItems.some(orderItem => orderItem.item && orderItem.item.item_id === item.item_id)
  );

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
                  options={index === orderItems.length - 1 ? remainingItems : availableItems}
                  getOptionLabel={(option) => option?.name || ''}
                  value={item.item || null}
                  onChange={(event, newValue) => {
                    onItemChange(index, 'item', newValue);
                    if (newValue) {
                      onItemChange(index, 'rate', newValue.purchase_price);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  fullWidth
                  isOptionEqualToValue={(option, value) => option.item_id === value.item_id}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.quantity || ''}
                  onChange={(e) => onItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </TableCell>
              <TableCell>
                {item.rate ? `$${item.rate}` : '-'}
              </TableCell>
              <TableCell>
                {item.quantity && item.rate
                  ? `$${(item.quantity * item.rate).toFixed(2)}`
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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 2 }}>
      <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
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

const NewPurchaseOrderPage = () => {
  const navigate = useNavigate();
  const [availableItems, setAvailableItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState({
    vendor_id: 0,
    vendor_name: '',
    vendor_address: '',
    vendor_phone: '',
    paymentStatus: 'Due',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [itemsResponse, vendorsResponse] = await Promise.all([
          api.get('/token/items/'),
          api.get('/token/vendors/')
        ]);
        setAvailableItems(itemsResponse.data);
        setVendors(vendorsResponse.data);
        setOrderItems([{ item: null, quantity: 1, rate: 0 }]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
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
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const addOrderItem = () => {
    setOrderItems(prevItems => [...prevItems, { item: null, quantity: 1, rate: 0 }]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.quantity * item.rate || 0), 0);
  };

  const handleSaveOrder = async () => {
    const orderData = {
      vendor_id: order.vendor_id,
      vendor_name: order.vendor_name,
      vendor_address: order.vendor_address,
      vendor_phone: order.vendor_phone,
      payment_status: order.paymentStatus === 'Paid' ? 'PAID' : 'UNPAID',
      items: orderItems.filter(item => item.item && item.quantity).map(({ item, quantity, rate }) => ({
        item_id: item.item_id,
        quantity: parseInt(quantity),
        rate: parseFloat(rate)
      })),
      total_amount: calculateTotal()
    };

    try {
      const response = await api.post('/token/purchaseorders/', orderData);
      console.log('Purchase order saved successfully:', response.data);
      navigate('/purchases/purchase_orders');
    } catch (error) {
      console.error('Error saving purchase order:', error.response ? error.response.data : error);
      setError('Failed to save purchase order. Please check the form and try again.');
    }
  };

  const isOrderValid = () => {
    return order.vendor_id !== 0 && orderItems.some(item => item.item && item.quantity > 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>New Purchase Order</Typography>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <VendorForm
              vendors={vendors}
              order={order}
              onOrderChange={handleOrderChange}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <OrderItemsTable
              orderItems={orderItems}
              availableItems={availableItems}
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
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleSaveOrder} 
          disabled={loading || error || !isOrderValid()}
        >
          Save Purchase Order
        </Button>
      </Box>
    </Box>
  );
};

export default NewPurchaseOrderPage;