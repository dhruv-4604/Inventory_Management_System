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
import axios from 'axios';
import api from '../../api';

const SaleOrdersPage = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(110);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSaleOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, salesOrders]);

  const fetchSaleOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/token/saleorders/');
      setSalesOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching sale orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    const filtered = salesOrders.filter(order => 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sale_order_id.toString().includes(searchTerm)
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
      await api.put(`/token/saleorders/${orderId}/`, { payment_received: true });
      // After successful update, fetch the updated orders
      fetchSaleOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleDownloadInvoice = (orderId) => {
    console.log(`Downloading invoice for order ${orderId}`);
    // In a real application, this would trigger the download of a file
  };

  const handleOpenNewOrderPage = () => {
    navigate('/sales/new_order');
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
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField 
          variant="outlined"
          placeholder="Search sales order"
          value={searchTerm}
          onChange={handleSearch}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
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
        <Table sx={{ minWidth: 650 }} aria-label="sales orders table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>ORDER DATE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ORDER ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CUSTOMER NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>AMOUNT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PAYMENT</TableCell>
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
                    key={order.sale_order_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>INV000{order.sale_order_id}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{`₹ ${order.total_amount}`}</TableCell>
                    <TableCell>
                      {!order.payment_received ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePayment(order.sale_order_id)}
                          size="small"
                        >
                          Mark as Paid
                        </Button>
                      ) : (
                        'Paid'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<GetAppIcon />}
                        onClick={() => handleDownloadInvoice(order.sale_order_id)}
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

export default SaleOrdersPage;