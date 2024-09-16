// CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import CategoryCard from './CategoryCard';
import api from '../../api';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', image: '', items: [] });
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [uncategorizedItems, setUncategorizedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

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

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('http://localhost:8000/token/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.get('http://localhost:8000/token/items/');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
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
    setSelectedItems([]);
  };

  useEffect(() => {
    if (openDialog) {
      fetchUncategorizedItems();
    }
  }, [openDialog]);

  const fetchUncategorizedItems = async () => {
    try {
      const response = await api.get('http://localhost:8000/token/items/');
      const items = response.data.filter(item => item.category === null);
      setUncategorizedItems(items);
    } catch (error) {
      console.error('Error fetching uncategorized items:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      
      selectedItems.forEach((itemId) => {
        formData.append('item_ids', itemId);
      });

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await api.post('http://localhost:8000/token/categories/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      await fetchCategories(); // Refresh categories after adding a new one
      await fetchItems(); // Refresh items to update their categories
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleItemToggle = (itemId) => {
    setSelectedItems(prevItems =>
      prevItems.includes(itemId)
        ? prevItems.filter(id => id !== itemId)
        : [...prevItems, itemId]
    );
  };

  const handleAddItemsToCategory = async (categoryId, itemsToAdd) => {
    try {
      const formData = new FormData();
      formData.append('category_id', categoryId);
      itemsToAdd.forEach(item => formData.append('item_ids', item.item_id));

      await api.post('http://localhost:8000/token/categories/add_items/', formData);
      
      await fetchItems(); // Refresh items to update their categories
      await fetchCategories(); // Refresh categories to update top selling items
    } catch (error) {
      console.error('Error adding items to category:', error);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
              items={items.filter(item => item.category === category.id)} 
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
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2, mb: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" sx={{ ml: 1 }}>
              {selectedFile.name}
            </Typography>
          )}
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
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Assign Uncategorized Items:
          </Typography>
          <List sx={{ maxHeight: 200, overflow: 'auto' }}>
            {uncategorizedItems.map((item) => (
              <ListItem key={item.item_id} disablePadding>
                <ListItemButton onClick={() => handleItemToggle(item.item_id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedItems.includes(item.item_id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
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