import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, InputAdornment, Typography, TablePagination, Pagination, Menu, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ClearIcon from '@mui/icons-material/Clear';
import api from '../../api';

const SHIPMENTS_PER_PAGE = 10;

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

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

  const greyButtonStyle = {
    border: '2px solid #DEDEDE',
    color: '#AEAEAE',
    boxShadow: 'none',
    backgroundColor: '#FFFFFF',
    '&:hover': {
      border: '2px solid #616161',
      color: '#616161',
      backgroundColor: '#FFFFFF',
      boxShadow: 'none',
    },
    textTransform: 'none',
    fontWeight: 'semibold',
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortFieldSelect = (field) => {
    setSortField(field);
    setSortOrder('asc');
    handleSortClose();
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleClearSort = () => {
    setSortField(null);
    setSortOrder(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const sortedAndFilteredShipments = useMemo(() => {
    let result = shipments.filter(shipment =>
      shipment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.order_id.toString().includes(searchTerm) ||
      shipment.tracking_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortField && sortOrder) {
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [shipments, searchTerm, sortField, sortOrder]);

  const paginatedShipments = sortedAndFilteredShipments.slice(
    (page - 1) * SHIPMENTS_PER_PAGE,
    page * SHIPMENTS_PER_PAGE
  );

  const pageCount = Math.ceil(sortedAndFilteredShipments.length / SHIPMENTS_PER_PAGE);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SortIcon />}
            onClick={handleSortClick}
            sx={buttonStyle}
          >
            Sort
          </Button>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortClose}
          >
            <MenuItem onClick={() => handleSortFieldSelect('date')}>Date</MenuItem>
            <MenuItem onClick={() => handleSortFieldSelect('order_id')}>Order ID</MenuItem>
            <MenuItem onClick={() => handleSortFieldSelect('customer_name')}>Customer Name</MenuItem>
            <MenuItem onClick={() => handleSortFieldSelect('status')}>Status</MenuItem>
          </Menu>
          {sortField && (
            <Button
              variant="contained"
              onClick={handleSortOrderToggle}
              startIcon={sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              sx={greyButtonStyle}
            >
              {`${sortField} (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
            </Button>
          )}
          {(sortField || sortOrder) && (
            <Button
              variant="contained"
              onClick={handleClearSort}
              startIcon={<ClearIcon />}
              sx={greyButtonStyle}
            >
              Clear Sort
            </Button>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField 
            variant="outlined"
            placeholder="Search shipments"
            value={searchTerm}
            onChange={handleSearch}
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
                borderRadius: '6px',
                backgroundColor: '#F3F4F6',
              },
            }}
          />
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
            {paginatedShipments.length > 0 ? (
              paginatedShipments.map((shipment) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="h6" color={'#5D5D5D'}>No Shipments Found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2">
          Page {page} of {pageCount}
        </Typography>
        <Pagination 
          count={pageCount} 
          page={page} 
          onChange={handleChangePage}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#232619',
            },
            '& .Mui-selected': {
              backgroundColor: '#D1EA67 !important',
              borderRadius: '6px',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ShipmentsPage;