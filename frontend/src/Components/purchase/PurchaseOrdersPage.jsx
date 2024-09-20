import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, InputAdornment, TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, purchaseOrders]);

  const fetchPurchaseOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/token/purchaseorders/');
      setPurchaseOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    const filtered = purchaseOrders.filter(order => 
      order.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.purchase_order_id.toString().includes(searchTerm)
    );
    setFilteredOrders(filtered);
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    const sorted = [...filteredOrders].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    setFilteredOrders(sorted);
  };

  const handlePayment = async (orderId) => {
    try {
      await api.put(`/token/purchaseorders/${orderId}/`, { payment_status: true });
      fetchPurchaseOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleDownloadInvoice = (orderId) => {
    console.log(`Downloading invoice for purchase order ${orderId}`);
    // Implement invoice download logic here
  };

  const handleOpenNewOrderPage = () => {
    navigate('/purchase/new-purchase-order');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) 
      ? date.toLocaleDateString()
      : 'Invalid Date';
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField 
          variant="outlined"
          placeholder="Search purchase order"
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
            onClick={handleOpenNewOrderPage}
          >
            New Order
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}>
        <Table sx={{ minWidth: 650 }} aria-label="purchase orders table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>ORDER DATE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ORDER ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>VENDOR NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>AMOUNT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PAYMENT STATUS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>INVOICE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No orders found</TableCell>
              </TableRow>
            ) : (
              filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow
                    key={order.purchase_order_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>{order.purchase_order_id}</TableCell>
                    <TableCell>{order.vendor_name}</TableCell>
                    <TableCell>{`₹ ${order.total_amount}`}</TableCell>
                    <TableCell>
                      {order.payment_status ? (
                        'Paid'
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePayment(order.purchase_order_id)}
                          size="small"
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<GetAppIcon />}
                        onClick={() => handleDownloadInvoice(order.purchase_order_id)}
                        size="small"
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
};

export default PurchaseOrdersPage;