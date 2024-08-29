import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';

const initialItems = [
  { id: 1, name: 'Sofa', sku: 'Item 1 sku', type: 'Goods', description: 'A comfortable, modern sofa with plush cushions.', rate: 'Rs.731.00' },
  { id: 2, name: 'asd', sku: 'sd', type: 'Goods', description: '', rate: '' },
  { id: 3, name: 'asd', sku: 'sd', type: 'Goods', description: '', rate: '' },
];

const PriceListPage = () => {
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Implement search logic here
  };

  const handleSort = () => {
    // Implement sort logic here
  };

  const handleAddNewItem = () => {
    // Implement add new item logic here
  };

  const buttonStyle = {
    background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
    color: '#232619',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    textTransform: 'none',
    fontWeight: 'bold',
    padding: '4px 16px',
    height: '32px',
    minWidth: '100px',
    fontSize: '0.875rem',
    '&:hover': {
      background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
    },
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<SortIcon />}
          onClick={handleSort}
          sx={buttonStyle}
        >
          Sort
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search item"
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
              borderRadius: '20px',
              backgroundColor: '#F3F4F6',
              height: '36px',
            },
            '& .MuiOutlinedInput-input': {
              padding: '8px 14px',
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewItem}
          sx={buttonStyle}
        >
          New Item
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}>
        <Table sx={{ minWidth: 650 }} aria-label="price list table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell padding="checkbox">
                <Checkbox color="primary" />
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>TYPE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DESCRIPTION</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>RATE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox color="primary" />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.rate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PriceListPage;