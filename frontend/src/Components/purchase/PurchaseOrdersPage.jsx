import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, InputAdornment, Pagination, Typography, Menu, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const ORDERS_PER_PAGE = 6;

const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/token/purchaseorders/');
      setPurchaseOrders(response.data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

  const sortedAndFilteredOrders = useMemo(() => {
    let result = purchaseOrders.filter(order =>
      order.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.purchase_order_id.toString().includes(searchTerm)
    );

    if (sortField && sortOrder) {
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [purchaseOrders, searchTerm, sortField, sortOrder]);

  const paginatedOrders = sortedAndFilteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  const pageCount = Math.ceil(sortedAndFilteredOrders.length / ORDERS_PER_PAGE);

  const handlePayment = async (orderId) => {
    try {
      await api.put(`/token/purchaseorders/${orderId}/`, { payment_status: true });
      fetchPurchaseOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleOpenNewOrderPage = () => {
    navigate('/purchase/new-purchase-order');
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

  const greyButtonStyle = {
    backgroundColor: '#F3F4F6',
    color: '#232619',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#E5E7EB',
      boxShadow: 'none'
    },
    textTransform: 'none',
    fontWeight: 'semibold',
    padding: '6px 16px',
    height: '36px',
  };

  return (
    <Box sx={{ p: 2, fontFamily: "ClashGrotesk-Medium", color: "#232619" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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
            <MenuItem onClick={() => handleSortFieldSelect('purchase_order_id')}>Order ID</MenuItem>
            <MenuItem onClick={() => handleSortFieldSelect('vendor_name')}>Vendor Name</MenuItem>
            <MenuItem onClick={() => handleSortFieldSelect('total_amount')}>Amount</MenuItem>
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
            placeholder="Search order"
            variant="outlined"
            size="small"
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
              width: "300px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                backgroundColor: "#F3F4F6",
              },
            }}
          />
          <Button
            onClick={handleOpenNewOrderPage}
            variant="contained"
            startIcon={<AddIcon />}
            sx={buttonStyle}
          >
            New Order
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #E5E7EB" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
              <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>ORDER DATE</TableCell>
              <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>ORDER ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>VENDOR NAME</TableCell>
              <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>AMOUNT</TableCell>
              <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>PAYMENT STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading...</TableCell>
              </TableRow>
            ) : paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" color={'#5D5D5D'}>No Orders Found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow
                  key={order.purchase_order_id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "#F3F4F6" },
                  }}
                >
                  <TableCell sx={{ padding: "20px 16px" }}>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ padding: "20px 16px" }}>PO000{order.purchase_order_id}</TableCell>
                  <TableCell sx={{ padding: "20px 16px" }}>{order.vendor_name}</TableCell>
                  <TableCell sx={{ padding: "20px 16px" }}>{`₹ ${order.total_amount}`}</TableCell>
                  <TableCell sx={{ padding: "20px 16px" }}>
                    {!order.payment_status ? (
                      <Button
                        variant="contained"
                        onClick={() => handlePayment(order.purchase_order_id)}
                        size="small"
                        sx={buttonStyle}
                      >
                        Mark as Paid
                      </Button>
                    ) : (
                      'Paid'
                    )}
                  </TableCell>
                </TableRow>
              ))
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

export default PurchaseOrdersPage;