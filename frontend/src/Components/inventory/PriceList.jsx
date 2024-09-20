import React, { useState, useEffect, useMemo } from 'react';
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
  InputAdornment,
  TableSortLabel,
  Pagination,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ClearIcon from '@mui/icons-material/Clear';
import api from '../../api';

const ITEMS_PER_PAGE = 10;

const PriceListPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

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
    setPage(1);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (key) => {
    setSortConfig({ key, direction: 'asc' });
    handleSortClose();
  };

  const handleSortDirectionToggle = () => {
    setSortConfig(prevConfig => ({
      ...prevConfig,
      direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleClearSort = () => {
    setSortConfig({ key: null, direction: 'asc' });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleAddNewItem = () => {
    // Implement add new item logic here
  };

  const sortedAndFilteredItems = useMemo(() => {
    let result = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categories[item.category] && categories[item.category].toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [items, searchTerm, sortConfig, categories]);

  const paginatedItems = sortedAndFilteredItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const pageCount = Math.ceil(sortedAndFilteredItems.length / ITEMS_PER_PAGE);

  const buttonStyle = {
    background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
    color: '#232619',
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: 'semibold',
    padding: '6px 16px',
    height: '36px',
    minWidth: '100px',
    fontSize: '0.875rem',
    '&:hover': {
      background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
      boxShadow: 'none',
    },
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
    padding: '4px 12px',
    height: '36px',
    minWidth: '100px',
    fontSize: '0.875rem',
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            <MenuItem onClick={() => handleSortSelect('name')}>Name</MenuItem>
            <MenuItem onClick={() => handleSortSelect('quantity')}>Quantity</MenuItem>
            <MenuItem onClick={() => handleSortSelect('selling_price')}>Rate</MenuItem>
          </Menu>
          {sortConfig.key && (
            <Button
              variant="contained"
              onClick={handleSortDirectionToggle}
              startIcon={sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              sx={greyButtonStyle}
            >
              {`${sortConfig.key} (${sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'})`}
            </Button>
          )}
          {sortConfig.key && (
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
              borderRadius: '6px',
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
            {paginatedItems.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{categories[item.category] || 'Unknown'}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">₹ {item.selling_price}</TableCell>
              </TableRow>
            ))}
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

export default PriceListPage;