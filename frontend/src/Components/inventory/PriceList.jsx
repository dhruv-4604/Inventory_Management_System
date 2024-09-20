import React, { useState, useEffect } from 'react';
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
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api';

const PriceListPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          api.get('/token/items/'),
          api.get('/token/categories/')
        ]);

        const categoriesMap = {};
        categoriesResponse.data.forEach(category => {
          categoriesMap[category.id] = category.name;
        });

        setCategories(categoriesMap);
        setItems(itemsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
              <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>QUANTITY</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CATEGORY</TableCell>
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
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{categories[item.category] || 'Unknown'}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.selling_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PriceListPage;