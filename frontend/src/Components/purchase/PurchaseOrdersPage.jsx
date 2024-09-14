import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';

// Mock data for purchase orders
const mockPurchaseOrders = [
  { id: 1, date: '5/1/2023', vendorName: 'Supplier A', status: 'Pending', amount: 1500.00, payment: 'Mark as Paid' },
  { id: 2, date: '5/2/2023', vendorName: 'Supplier B', status: 'Paid', amount: 2000.00, payment: 'Paid' },
  { id: 3, date: '5/3/2023', vendorName: 'Supplier C', status: 'Received', amount: 1750.00, payment: 'Mark as Paid' },
];

const PurchaseOrdersPage = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching for:', searchTerm);
  };

  const handleSort = () => {
    // Implement sorting logic here
    console.log('Sorting purchase orders');
  };

  const handleNewOrder = () => {
    navigate('/purchase/new-purchase-order');
  };

  const handleMarkAsPaid = (orderId) => {
    setPurchaseOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'Paid', payment: 'Paid' } : order
      )
    );
  };

  const handleDownloadInvoice = (orderId) => {
    // Implement invoice download logic here
    console.log('Downloading invoice for order:', orderId);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField 
          variant="outlined"
          placeholder="Search purchase order"
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
            onClick={handleNewOrder}
            sx={{
              backgroundColor: '#D9F99D',
              color: '#000',
              '&:hover': { backgroundColor: '#BEF264' },
            }}
          >
            New Order
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="purchase orders table">
          <TableHead>
            <TableRow>
              <TableCell>ORDER DATE</TableCell>
              <TableCell>ORDER ID</TableCell>
              <TableCell>VENDOR NAME</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>AMOUNT</TableCell>
              <TableCell>PAYMENT</TableCell>
              <TableCell>INVOICE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.vendorName}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>${order.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {order.payment === 'Mark as Paid' ? (
                    <Button
                      variant="contained"
                      onClick={() => handleMarkAsPaid(order.id)}
                      sx={{
                        backgroundColor: '#60A5FA',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#3B82F6' },
                      }}
                    >
                      Mark as Paid
                    </Button>
                  ) : (
                    order.payment
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadInvoice(order.id)}
                    sx={{ color: '#60A5FA', borderColor: '#60A5FA' }}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PurchaseOrdersPage;