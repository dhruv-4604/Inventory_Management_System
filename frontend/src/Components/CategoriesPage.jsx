// CategoriesPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import CategoryCard from './CategoryCard';

// Mock data for categories
const mockCategories = [
  { id: 1, name: 'Laptops', image: 'https://picsum.photos/200/300', topSelling: 'Acer Book 3 Pro' },
  { id: 2, name: 'Smartphones', image: 'https://picsum.photos/200/300', topSelling: 'iPhone 13' },
];

// Mock data for items
const mockItems = [
  { id: 1, name: 'Laptop A', sku: 'LAP001', price: 999.99, categoryId: 1 },
  { id: 2, name: 'Smartphone B', sku: 'PHN001', price: 699.99, categoryId: 2 },
  { id: 3, name: 'Tablet C', sku: 'TAB001', price: 349.99, categoryId: null },
  { id: 4, name: 'Headphones D', sku: 'AUD001', price: 149.99, categoryId: null },
  { id: 5, name: 'Speaker E', sku: 'AUD002', price: 199.99, categoryId: null },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [items, setItems] = useState(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', image: '', items: [] });
  const [itemSearchTerm, setItemSearchTerm] = useState('');

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
    // Implement category search logic here
    console.log('Searching for:', searchTerm);
  };

  const handleSort = () => {
    // Implement sorting logic here
    console.log('Sorting categories');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCategory({ name: '', image: '', items: [] });
    setItemSearchTerm('');
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      const newCategoryId = categories.length + 1;
      const newCategoryWithId = {
        ...newCategory,
        id: newCategoryId,
        topSelling: newCategory.items[0]?.name || 'N/A',
      };
      
      // Update categories
      setCategories(prevCategories => [...prevCategories, newCategoryWithId]);

      // Update items
      setItems(prevItems => prevItems.map(item => 
        newCategory.items.some(selectedItem => selectedItem.id === item.id)
          ? { ...item, categoryId: newCategoryId }
          : item
      ));

      handleCloseDialog();
    }
  };

  const handleItemToggle = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setNewCategory(prev => {
        const isCurrentlySelected = prev.items.some(i => i.id === itemId);
        if (isCurrentlySelected) {
          return { ...prev, items: prev.items.filter(i => i.id !== itemId) };
        } else {
          return { ...prev, items: [...prev.items, item] };
        }
      });
    }
  };

  const handleAddItemsToCategory = (categoryId, itemsToAdd) => {
    setItems(prevItems => prevItems.map(item => 
      itemsToAdd.some(newItem => newItem.id === item.id)
        ? { ...item, categoryId: categoryId }
        : item
    ));

    // Update the category's top selling product if needed
    setCategories(prevCategories => prevCategories.map(category => 
      category.id === categoryId
        ? {
            ...category,
            topSelling: itemsToAdd[0]?.name || category.topSelling,
          }
        : category
    ));
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

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
          onClick={handleOpenDialog}
        >
          New Category
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <CategoryCard 
              category={category} 
              items={items} 
              onAddItems={handleAddItemsToCategory}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Thumbnail URL (optional)"
            type="text"
            fullWidth
            value={newCategory.image}
            onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Search Items"
            type="text"
            fullWidth
            value={itemSearchTerm}
            onChange={(e) => setItemSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List sx={{ maxHeight: 200, overflow: 'auto' }}>
            {filteredItems.map((item) => (
              <ListItem key={item.id} dense button onClick={() => handleItemToggle(item.id)}>
                <Checkbox
                  edge="start"
                  checked={newCategory.items.some(selectedItem => selectedItem.id === item.id)}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText 
                  primary={item.name} 
                  secondary={item.categoryId 
                    ? `Current Category: ${categories.find(c => c.id === item.categoryId)?.name}`
                    : 'Uncategorized'
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddCategory} sx={buttonStyle}>Add Category</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;