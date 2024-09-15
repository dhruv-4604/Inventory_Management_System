import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
    address: '',  // New field
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
      address: '',  // New field
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

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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
            width: '300px',
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
            sx={{
              mr: 1,
              backgroundColor: '#D9F99D',
              color: '#000',
              '&:hover': { backgroundColor: '#BEF264' },
            }}
          >
            Sort
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              backgroundColor: '#D9F99D',
              color: '#000',
              '&:hover': { backgroundColor: '#BEF264' },
            }}
          >
            Add Vendor
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="vendors table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell>PHONE NUMBER</TableCell>
              <TableCell>ADDRESS</TableCell>  {/* New column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.vendor_id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone_number}</TableCell>
                <TableCell>{vendor.address}</TableCell>  {/* New cell */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vendor</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={newVendor.phone_number}
              onChange={(e) => setNewVendor({ ...newVendor, phone_number: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={newVendor.address}
              onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#60A5FA' }}>Cancel</Button>
          <Button onClick={handleAddVendor} variant="contained" sx={{
            backgroundColor: '#D9F99D',
            color: '#000',
            '&:hover': { backgroundColor: '#BEF264' },
          }}>Add Vendor</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorsPage;