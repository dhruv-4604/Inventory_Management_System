import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, InputAdornment, Typography, TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';

import { useNavigate } from 'react-router-dom';

// Mock data for sales orders
const mockSalesOrders = [
  { id: 1, createdAt: '2023-05-01', customerName: 'John Doe', status: 'Pending', amount: 1500.00 },
  { id: 2, createdAt: '2023-05-02', customerName: 'Jane Smith', status: 'Paid', amount: 2000.00 },
  { id: 3, createdAt: '2023-05-03', customerName: 'Bob Johnson', status: 'Shipped', amount: 1750.00 },
  // Add more mock data as needed
];

const SaleOrdersPage = () => {
  const [salesOrders, setSalesOrders] = useState(mockSalesOrders);
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
    const filteredOrders = mockSalesOrders.filter(order => 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    );
    setSalesOrders(filteredOrders);
  };

  const handleSort = () => {
    const sortedOrders = [...salesOrders].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setSalesOrders(sortedOrders);
  };

  const handlePayment = (orderId) => {
    const updatedOrders = salesOrders.map(order => 
      order.id === orderId ? { ...order, status: 'Paid' } : order
    );
    setSalesOrders(updatedOrders);
  };

  const handleDownloadInvoice = (orderId) => {
    console.log(`Downloading invoice for order ${orderId}`);
    // In a real application, this would trigger the download of a file
  };





 
  const navigate = useNavigate();

  const handleOpenNewOrderPage = () => {
    navigate('/sales/new_order');
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
          placeholder="Search sales order"
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
              <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>AMOUNT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PAYMENT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>INVOICE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow
                  key={order.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{`$${order.amount.toFixed(2)}`}</TableCell>
                  <TableCell>
                    {order.status !== 'Paid' ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePayment(order.id)}
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
                      onClick={() => handleDownloadInvoice(order.id)}
                      size="small"
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={salesOrders.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    </Box>
  );
};

export default SaleOrdersPage;