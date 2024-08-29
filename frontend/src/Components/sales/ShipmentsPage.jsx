import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, InputAdornment, Typography, TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';

// Mock data for shipments
const mockShipments = [
  { id: 1, createdAt: '2023-05-01', orderNumber: 'ORD-001', customerName: 'John Doe', carrier: 'FedEx', trackingId: 'FDX123456789', status: 'In Transit' },
  { id: 2, createdAt: '2023-05-02', orderNumber: 'ORD-002', customerName: 'Jane Smith', carrier: 'UPS', trackingId: 'UPS987654321', status: 'Delivered' },
  { id: 3, createdAt: '2023-05-03', orderNumber: 'ORD-003', customerName: 'Bob Johnson', carrier: 'DHL', trackingId: 'DHL246813579', status: 'Processing' },
  // Add more mock data as needed
];

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState(mockShipments);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleSearch = () => {
    const filteredShipments = mockShipments.filter(shipment => 
      shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setShipments(filteredShipments);
  };

  const handleSort = () => {
    const sortedShipments = [...shipments].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setShipments(sortedShipments);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
     
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField 
          variant="outlined"
          placeholder="Search shipments"
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
            sx={{ ...buttonStyle, mr: 2 }}
            onClick={handleSort}
          >
            Sort
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={buttonStyle}
          >
            New Shipment
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}>
        <Table sx={{ minWidth: 650 }} aria-label="shipments table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>CREATED DATE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ORDER NUMBER</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CUSTOMER NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CARRIER</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>TRACKING ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((shipment) => (
                <TableRow
                  key={shipment.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{new Date(shipment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{shipment.orderNumber}</TableCell>
                  <TableCell>{shipment.customerName}</TableCell>
                  <TableCell>{shipment.carrier}</TableCell>
                  <TableCell>{shipment.trackingId}</TableCell>
                  <TableCell>{shipment.status}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={shipments.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ShipmentsPage;