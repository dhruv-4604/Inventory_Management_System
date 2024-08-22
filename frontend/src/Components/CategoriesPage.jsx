// CategoriesPage.jsx
import React, { useState } from 'react';
import {
  Box, Grid, TextField, InputAdornment, Button, Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import CategoryCard from './CategoryCard'; // Import the CategoryCard component

// Mock data for categories
const mockCategories = [
  { id: 1, name: 'Laptops', image: 'https://picsum.photos/200/300', topSelling: 'Acer Book 3 Pro', productCount: 48 },
  { id: 2, name: 'Mobile Phones', image: 'https://picsum.photos/200/300', topSelling: 'iPhone 13 Pro', productCount: 36 },
  { id: 3, name: 'Televisions', image: 'https://picsum.photos/200/300', topSelling: 'Samsung QLED', productCount: 24 },
  { id: 4, name: 'Tablets', image: 'https://picsum.photos/200/300', topSelling: 'iPad Air', productCount: 30 },
  { id: 1, name: 'Laptops', image: 'https://picsum.photos/200/300', topSelling: 'Acer Book 3 Pro', productCount: 48 },
  { id: 2, name: 'Mobile Phones', image: 'https://picsum.photos/200/300', topSelling: 'iPhone 13 Pro', productCount: 36 },
  { id: 3, name: 'Televisions', image: 'https://picsum.photos/200/300', topSelling: 'Samsung QLED', productCount: 24 },
  { id: 4, name: 'Tablets', image: 'https://picsum.photos/200/300', topSelling: 'iPad Air', productCount: 30 },
  { id: 1, name: 'Laptops', image: 'https://picsum.photos/200/300', topSelling: 'Acer Book 3 Pro', productCount: 48 },
  { id: 2, name: 'Mobile Phones', image: 'https://picsum.photos/200/300', topSelling: 'iPhone 13 Pro', productCount: 36 },
  { id: 3, name: 'Televisions', image: 'https://picsum.photos/200/300', topSelling: 'Samsung QLED', productCount: 24 },
  { id: 4, name: 'Tablets', image: 'https://picsum.photos/200/300', topSelling: 'iPad Air', productCount: 30 },
  { id: 4, name: 'Tablets', image: 'https://picsum.photos/200/300', topSelling: 'iPad Air', productCount: 30 },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');

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
    padding: '8px 16px',
    borderRadius: '8px',
  };

  const handleSearch = () => {
    const filteredCategories = mockCategories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCategories(filteredCategories);
  };

  const handleSort = () => {
    // Implement sorting logic here
    console.log('Sorting categories');
  };

  const handleAddCategory = () => {
    // Implement add category logic here
    console.log('Adding new category');
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
     
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<SortIcon />}
          sx={{ ...buttonStyle, mr: 2, backgroundColor: '#F0F0F0', color: '#000' }}
          onClick={handleSort}
        >
          Sort
        </Button>
        <TextField 
          variant="outlined"
          placeholder="Search item"
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={buttonStyle}
          onClick={handleAddCategory}
        >
          New Category
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <CategoryCard category={category} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoriesPage;