import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api';

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/token/vendors/');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching for:', searchTerm);
  };

  const handleSort = () => {
    // Implement sorting logic here
    console.log('Sorting vendors');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewVendor({
      name: '',
      email: '',
      phone_number: '',
      address: '',
      state: '',
      city: '',
      pincode: '',
    });
  };

  const handleAddVendor = async () => {
    try {
      const response = await api.post('/token/vendors/', newVendor);
      setVendors([...vendors, response.data]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding vendor:', error);
      // You might want to show an error message to the user here
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

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <TextField 
          variant="outlined"
          placeholder="Search vendor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
            onClick={handleSort}
            sx={{ ...buttonStyle, mr: 2 }}
          >
            Sort
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={buttonStyle}
          >
            Add Vendor
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}>
        <Table sx={{ minWidth: 650 }} aria-label="vendors table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PHONE NUMBER</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ADDRESS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>STATE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CITY</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PINCODE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.vendor_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone_number}</TableCell>
                <TableCell>{vendor.address}</TableCell>
                <TableCell>{vendor.state}</TableCell>
                <TableCell>{vendor.city}</TableCell>
                <TableCell>{vendor.pincode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vendor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newVendor.phone_number}
                onChange={(e) => setNewVendor({ ...newVendor, phone_number: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={newVendor.address}
                onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="State"
                value={newVendor.state}
                onChange={(e) => setNewVendor({ ...newVendor, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="City"
                value={newVendor.city}
                onChange={(e) => setNewVendor({ ...newVendor, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={newVendor.pincode}
                onChange={(e) => setNewVendor({ ...newVendor, pincode: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddVendor} sx={buttonStyle}>Add Vendor</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorsPage;