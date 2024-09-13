import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, Button, TextField, InputAdornment, Modal, Typography,
  Grid, Select, MenuItem, FormControl, InputLabel, FormHelperText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import api from '../../api';



const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchCustomers();
    fetchStates();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers/');  
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states');
      setStates(response.data.states);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const response = await axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`);
      setCities(response.data.districts);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCustomer({
      name: '',
      email: '',
      phone_number: '',
      address: '',
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prevState => ({ ...prevState, [name]: value }));
    if (name === 'state') {
      const selectedState = states.find(state => state.state_id === parseInt(value));
      fetchCities(selectedState.state_id);
      setNewCustomer(prevState => ({ ...prevState, city: '' }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.name = newCustomer.name ? "" : "Name is required";
    tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email) ? "" : "Email is not valid";
    tempErrors.phone_number = /^[6-9]\d{9}$/.test(newCustomer.phone_number) ? "" : "Phone number is not valid";
    tempErrors.address = newCustomer.address ? "" : "Address is required";

    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleAddCustomer = async () => {
    if (validateForm()) {
      try {
        const response = await api.post('/customers/', newCustomer);
        if (response.data) {
          setCustomers(prevCustomers => [...prevCustomers, response.data]);
          handleCloseModal();
          console.log('Customer added successfully:', response.data);
          // Add a success message for the user here
        } else {
          throw new Error('No data received from the server');
        }
      } catch (error) {
        console.error('Error adding customer:', error.response ? error.response.data : error.message);
        let errorMessage = 'Failed to add customer. ';
        if (error.response && error.response.data) {
          if (error.response.data.user) {
            errorMessage += error.response.data.user.join(', ');
          } else {
            errorMessage += JSON.stringify(error.response.data);
          }
        }
        alert(errorMessage);
      }
    } else {
      console.log('Form validation failed');
      // ... existing code for form validation failure ...
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField 
          variant="outlined"
          placeholder="Search customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '40%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#F3F4F6',
              height: '40px',
            },
          }}
        />
        <Box>
          <Button
            variant="contained"
            startIcon={<SortIcon />}
            sx={{ ...buttonStyle, mr: 2 }}
          >
            Sort
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={buttonStyle}
            onClick={handleOpenModal}
          >
            Add Customer
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}>
        <Table sx={{ minWidth: 650 }} aria-label="customer table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell padding="checkbox">
                <Checkbox color="primary" />
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PHONE NUMBER</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ADDRESS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox color="primary" />
                </TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell>{customer.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-customer-modal"
        aria-describedby="modal-to-add-new-customer"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 'none',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Customer
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={newCustomer.name}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={newCustomer.phone_number}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.phone_number}
                helperText={errors.phone_number}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={newCustomer.address}
                onChange={handleInputChange}
                variant="outlined"
                multiline
                rows={3}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
              sx={{
                ...buttonStyle,
                '&:hover': {
                  background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
                },
              }}
            >
              Add Customer
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomerPage;