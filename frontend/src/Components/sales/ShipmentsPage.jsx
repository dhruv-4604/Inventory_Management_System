import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, InputAdornment, Typography, TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api';

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await api.get('token/shipments/');
      setShipments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch shipments');
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filteredShipments = shipments.filter(shipment => 
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

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
              <TableCell sx={{ fontWeight: 'bold' }}>DATE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ORDER ID</TableCell>
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
                  key={shipment.shipment_id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{new Date(shipment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{shipment.order_id}</TableCell>
                  <TableCell>{shipment.customer_name}</TableCell>
                  <TableCell>{shipment.carrier}</TableCell>
                  <TableCell>{shipment.tracking_id}</TableCell>
                  <TableCell>{shipment.status}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

     
    </Box>
  );
};

export default ShipmentsPage;