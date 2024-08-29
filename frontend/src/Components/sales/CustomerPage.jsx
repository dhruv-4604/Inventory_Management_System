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

const CustomerPage = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@example.com',
      phoneNumber: '9876543210',
      address: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    // Add more initial customer data as needed
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchStates();
  }, []);

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
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      state: '',
      city: '',
      pincode: '',
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
    tempErrors.firstName = newCustomer.firstName ? "" : "First name is required";
    tempErrors.lastName = newCustomer.lastName ? "" : "Last name is required";
    tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email) ? "" : "Email is not valid";
    tempErrors.phoneNumber = /^[6-9]\d{9}$/.test(newCustomer.phoneNumber) ? "" : "Phone number is not valid";
    tempErrors.address = newCustomer.address ? "" : "Address is required";
    tempErrors.state = newCustomer.state ? "" : "State is required";
    tempErrors.city = newCustomer.city ? "" : "City is required";
    tempErrors.pincode = /^[1-9][0-9]{5}$/.test(newCustomer.pincode) ? "" : "Pincode is not valid";

    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleAddCustomer = () => {
    if (validateForm()) {
      const newCustomerWithId = {
        ...newCustomer,
        id: customers.length + 1, // Simple ID generation
        state: states.find(s => s.state_id === parseInt(newCustomer.state))?.state_name || newCustomer.state
      };
      setCustomers([...customers, newCustomerWithId]);
      handleCloseModal();
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
              <TableCell sx={{ fontWeight: 'bold' }}>FIRST NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>LAST NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PHONE NUMBER</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ADDRESS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CITY</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>STATE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PINCODE</TableCell>
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
                <TableCell>{customer.firstName}</TableCell>
                <TableCell>{customer.lastName}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>{customer.state}</TableCell>
                <TableCell>{customer.pincode}</TableCell>
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={newCustomer.firstName}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={newCustomer.lastName}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.lastName}
                helperText={errors.lastName}
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
                name="phoneNumber"
                value={newCustomer.phoneNumber}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
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
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.state}>
                <InputLabel>State</InputLabel>
                <Select
                  value={newCustomer.state}
                  label="State"
                  name="state"
                  onChange={handleInputChange}
                >
                  {states.map((state) => (
                    <MenuItem key={state.state_id} value={state.state_id}>
                      {state.state_name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.state}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.city}>
                <InputLabel>City</InputLabel>
                <Select
                  value={newCustomer.city}
                  label="City"
                  name="city"
                  onChange={handleInputChange}
                  disabled={!newCustomer.state}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.district_id} value={city.district_name}>
                      {city.district_name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.city}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={newCustomer.pincode}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.pincode}
                helperText={errors.pincode}
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