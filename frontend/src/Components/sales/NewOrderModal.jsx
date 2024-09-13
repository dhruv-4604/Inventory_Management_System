import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Modal, Select, MenuItem, FormControl, InputLabel,
  Autocomplete, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import axios from 'axios';

import api from "../../api";

// Mock data for existing customers (replace this with actual data from your backend)
const existingCustomers = [
  { id: 1, name: 'John Doe', phoneNumber: '123-456-7890' },
  { id: 2, name: 'Jane Smith', phoneNumber: '098-765-4321' },
  { id: 3, name: 'Bob Johnson', phoneNumber: '555-555-5555' },
  // ... add more customers as needed
];

// Mock data for courier partners (replace with actual data)
const courierPartners = [
  'FedEx', 'UPS', 'DHL', 'USPS'
];

const buttonStyle = {
  background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
  color: '#232619',
  boxShadow: 'none',  
  '&:hover': {
    background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
    boxShadow: 'none'
  },
  textTransform: 'none',
  fontWeight: 'semibold',
  padding: '6px 16px',
  height: '36px',
};

const NewOrderModal = ({ open, handleClose, handleSave }) => {
  const [newOrder, setNewOrder] = useState({
    customerId: null,
    customerName: '',
    phoneNumber: '',
    amount: 0,
    status: 'Pending',
    orderMode: 'AT SHOP',
    address: '',
    courierPartner: '',
    items: [],
    paymentStatus: 'Due'
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [availableItems, setAvailableItems] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await  api.get('/token/items/'); // Adjust this URL to match your API endpoint
        setAvailableItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    const fetchCustomers = async () => {
      try {
      const response = await api.get('/customers/');  // Adjust this URL to match your API endpoint
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchItems();
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (event, value) => {
    if (value && value.id) {
      // Existing customer selected
      setNewOrder(prev => ({ 
        ...prev, 
        customerId: value.id, 
        customerName: value.name,
        phoneNumber: value.phoneNumber // Auto-fill phone number
      }));
    } else {
      // New customer or no customer selected
      setNewOrder(prev => ({ 
        ...prev, 
        customerId: null, 
        customerName: value || '',
        phoneNumber: '' // Clear phone number
      }));
    }
  };

  const handleAddItem = () => {
    if (selectedItem && itemQuantity > 0) {
      const newItem = {
        ...selectedItem,
        quantity: itemQuantity,
        total: selectedItem.price * itemQuantity
      };
      setNewOrder(prev => ({
        ...prev,
        items: [...prev.items, newItem],
        amount: prev.amount + newItem.total
      }));
      setSelectedItem(null);
      setItemQuantity(1);
    }
  };

  const handleRemoveItem = (index) => {
    setNewOrder(prev => {
      const updatedItems = [...prev.items];
      const removedItem = updatedItems.splice(index, 1)[0];
      return {
        ...prev,
        items: updatedItems,
        amount: prev.amount - removedItem.total
      };
    });
  };

  const handleSubmit = () => {
    console.log('Submitting new order', newOrder);
    handleSave(newOrder);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 1200,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Create New Sale Order
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              freeSolo
              options={customers}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return option.name || '';
              }}
              renderInput={(params) => (
                <TextField {...params} label="Customer" fullWidth />
              )}
              onChange={handleCustomerChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Customer Phone Number"
              name="phoneNumber"
              value={newOrder.phoneNumber}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="order-mode-label">Order Mode</InputLabel>
              <Select
                labelId="order-mode-label"
                id="order-mode"
                name="orderMode"
                value={newOrder.orderMode}
                label="Order Mode"
                onChange={handleChange}
              >
                <MenuItem value="AT SHOP">AT SHOP</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
              </Select>
            </FormControl>
            {newOrder.orderMode === 'Online' && (
              <>
                <TextField
                  fullWidth
                  label="Customer Address"
                  name="address"
                  value={newOrder.address}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="courier-partner-label">Courier Partner</InputLabel>
                  <Select
                    labelId="courier-partner-label"
                    id="courier-partner"
                    name="courierPartner"
                    value={newOrder.courierPartner}
                    label="Courier Partner"
                    onChange={handleChange}
                  >
                    {courierPartners.map((partner) => (
                      <MenuItem key={partner} value={partner}>{partner}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={availableItems}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <li {...props}>
                  {option.name} - ${option.price}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Select Item" fullWidth />}
              value={selectedItem}
              onChange={(event, newValue) => setSelectedItem(newValue)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleAddItem} sx={{ mb: 2 }}>
              Add Item
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newOrder.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">${item.price}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.total}</TableCell>
                      <TableCell align="right">
                        <Button onClick={() => handleRemoveItem(index)}>Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
              Total Amount: ${newOrder.amount}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="payment-status-label">Payment Status</InputLabel>
              <Select
                labelId="payment-status-label"
                id="payment-status"
                name="paymentStatus"
                value={newOrder.paymentStatus}
                label="Payment Status"
                onChange={handleChange}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Due">Due</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" onClick={handleSubmit} sx={buttonStyle}>
            Save Order
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewOrderModal;