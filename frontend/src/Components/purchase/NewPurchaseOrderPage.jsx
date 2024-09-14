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
          onOrderChange('vendorId', newValue?.vendor_id || null);
          onOrderChange('vendorName', newValue?.name || '');
          onOrderChange('phoneNumber', newValue?.phone_number || '');
          onOrderChange('address', newValue?.address || '');
        }}
        renderInput={(params) => <TextField {...params} label="Vendor" fullWidth />}
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
        label="Expected Delivery Date"
        type="date"
        value={order.expectedDeliveryDate}
        onChange={(e) => onOrderChange('expectedDeliveryDate', e.target.value)}
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />
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
                  value={item.quantity || ''}
                  onChange={(e) => onItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.rate || ''}
                  onChange={(e) => onItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
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
          <MenuItem value="Unpaid">Unpaid</MenuItem>
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
    vendorId: null,
    vendorName: '',
    phoneNumber: '',
    address: '',
    expectedDeliveryDate: '',
    paymentStatus: 'Unpaid'
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
        console.log('Items fetched:', itemsResponse.data);
        console.log('Vendors fetched:', vendorsResponse.data);
        setAvailableItems(itemsResponse.data);
        setVendors(vendorsResponse.data);
        setOrderItems([{ item: null, quantity: 1, rate: 0, amount: 0 }]);
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
      
      const item = newItems[index].item;
      const quantity = newItems[index].quantity || 0;
      const rate = newItems[index].rate || 0;
      
      newItems[index].amount = quantity * rate;
      
      return newItems;
    });
  };

  const addOrderItem = () => {
    setOrderItems(prevItems => [...prevItems, { item: null, quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const handleSaveOrder = async () => {
    const orderData = {
      vendorId: order.vendorId,
      vendorName: order.vendorName,
      vendorAddress: order.address,
      expectedDeliveryDate: order.expectedDeliveryDate,
      paymentStatus: order.paymentStatus,
      items: orderItems.map(({ item, quantity, rate }) => ({
        itemId: item.item_id,
        quantity,
        rate
      })),
      totalAmount: calculateTotal()
    };

    console.log('Purchase Order data to be sent to backend:', orderData);

    navigate('/purchase/purchase_orders');

    // Uncomment when backend is implemented
    // try {
    //   await api.post('/purchase-orders/', orderData);
    //   navigate('/purchase/purchase_orders');
    // } catch (error) {
    //   console.error('Error saving purchase order:', error);
    // }
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
        <Button variant="contained" onClick={handleSaveOrder} disabled={loading || error}>
          Save Purchase Order
        </Button>
      </Box>
    </Box>
  );
};

export default NewPurchaseOrderPage;