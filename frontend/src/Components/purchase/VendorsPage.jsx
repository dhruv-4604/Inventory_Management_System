import React, { useState } from 'react';
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

// Mock data for vendors
const mockVendors = [
  { id: 1, firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@example.com', phoneNumber: '9876543210', address: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
];

const VendorsPage = () => {
  const [vendors, setVendors] = useState(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newVendor, setNewVendor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

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
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
  };

  const handleAddVendor = () => {
    setVendors([...vendors, { ...newVendor, id: vendors.length + 1 }]);
    handleCloseDialog();
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
              <TableCell>FIRST NAME</TableCell>
              <TableCell>LAST NAME</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell>PHONE NUMBER</TableCell>
              <TableCell>ADDRESS</TableCell>
              <TableCell>CITY</TableCell>
              <TableCell>STATE</TableCell>
              <TableCell>PINCODE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{vendor.firstName}</TableCell>
                <TableCell>{vendor.lastName}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phoneNumber}</TableCell>
                <TableCell>{vendor.address}</TableCell>
                <TableCell>{vendor.city}</TableCell>
                <TableCell>{vendor.state}</TableCell>
                <TableCell>{vendor.pincode}</TableCell>
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
              label="First Name"
              value={newVendor.firstName}
              onChange={(e) => setNewVendor({ ...newVendor, firstName: e.target.value })}
              sx={{ flexBasis: '48%' }}
            />
            <TextField
              label="Last Name"
              value={newVendor.lastName}
              onChange={(e) => setNewVendor({ ...newVendor, lastName: e.target.value })}
              sx={{ flexBasis: '48%' }}
            />
            <TextField
              label="Email"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              sx={{ flexBasis: '48%' }}
            />
            <TextField
              label="Phone Number"
              value={newVendor.phoneNumber}
              onChange={(e) => setNewVendor({ ...newVendor, phoneNumber: e.target.value })}
              sx={{ flexBasis: '48%' }}
            />
            <TextField
              label="Address"
              value={newVendor.address}
              onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
              fullWidth
            />
            <FormControl sx={{ flexBasis: '48%' }}>
              <InputLabel>State</InputLabel>
              <Select
                value={newVendor.state}
                label="State"
                onChange={(e) => setNewVendor({ ...newVendor, state: e.target.value })}
              >
                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                {/* Add more states as needed */}
              </Select>
            </FormControl>
            <FormControl sx={{ flexBasis: '48%' }}>
              <InputLabel>City</InputLabel>
              <Select
                value={newVendor.city}
                label="City"
                onChange={(e) => setNewVendor({ ...newVendor, city: e.target.value })}
              >
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                {/* Add more cities as needed */}
              </Select>
            </FormControl>
            <TextField
              label="Pincode"
              value={newVendor.pincode}
              onChange={(e) => setNewVendor({ ...newVendor, pincode: e.target.value })}
              sx={{ flexBasis: '48%' }}
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