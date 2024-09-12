import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Modal, Select, MenuItem, FormControl, InputLabel,
  Autocomplete
} from '@mui/material';

// Mock data for existing customers (replace this with actual data from your backend)
const existingCustomers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson' },
  // ... add more customers as needed
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
    amount: '',
    status: 'Pending'
  });
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (event, value) => {
    if (value && value.inputValue) {
      // Handle the case when a new customer is being added
      setIsNewCustomer(true);
      setNewOrder(prev => ({ ...prev, customerName: value.inputValue, customerId: null }));
    } else if (value) {
      // An existing customer was selected
      setIsNewCustomer(false);
      setNewOrder(prev => ({ ...prev, customerId: value.id, customerName: value.name }));
    } else {
      // Clear selection
      setIsNewCustomer(false);
      setNewOrder(prev => ({ ...prev, customerId: null, customerName: '' }));
    }
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
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Create New Sale Order
        </Typography>
        <Autocomplete
          freeSolo
          options={existingCustomers}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            return option.name;
          }}
          renderInput={(params) => (
            <TextField {...params} label="Customer" fullWidth />
          )}
          onChange={handleCustomerChange}
          sx={{ mb: 2 }}
        />
        {isNewCustomer && (
          <TextField
            fullWidth
            label="New Customer Name"
            name="customerName"
            value={newOrder.customerName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        )}
        <TextField
          fullWidth
          label="Amount"
          name="amount"
          type="number"
          value={newOrder.amount}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={newOrder.status}
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSubmit} sx={buttonStyle}>
          Save Order
        </Button>
      </Box>
    </Modal>
  );
};

export default NewOrderModal;