// CategoryCard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import api from '../../api';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 280,
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1.5px solid #AEAEAE',
  boxShadow: 'none'
}));

const StyledCardContent = styled(CardContent)({
  padding: '16px',
});

const CategoryName = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '12px',
});

const TopSellingBox = styled(Box)({
  borderRadius: '6px',
  display: 'flex',
  marginBottom: '10px',
  fontWeight: '400',
});

const TopSellingLabel = styled(Typography)({
  backgroundColor: '#2E2E2E',
  color: 'white',
  padding: '0px 12px',
  fontSize: '12px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  zIndex: 1,
});

const TopSellingProduct = styled(Typography)({
  marginLeft: '-6px',
  backgroundColor: '#F0F0F0',
  color: '#333',
  padding: '6px 12px',
  fontSize: '12px',
  flexGrow: 1,
  border: '1px solid black',
  borderTopRightRadius: '8px',
  borderBottomRightRadius: '8px',
  display: 'flex',
  alignItems: 'center',
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
});

const StyledButton = styled(Button)({
  flex: 1,
  borderRadius: '6px',
  padding: '5px 0',
  marginTop: '12px',
  fontSize: '14px',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': { boxShadow: 'none' }
});

const ProductCountButton = styled(StyledButton)({
  backgroundColor: '#2E2E2E',
  color: 'white',
  '&:hover': {
    backgroundColor: '#2E2E2E',
  },
});

const AddItemsButton = styled(StyledButton)({
  background: 'linear-gradient(90deg, #D1EA67, #A6F15A)',
  color: '#232619',
  '&:hover': {
    background: 'linear-gradient(90deg, #D1EA67, #A6F15A)',
  },
});

const CategoryCard = ({ category, items, onItemsUpdated, onCategoryDeleted }) => {
  const [openProductsDialog, setOpenProductsDialog] = useState(false);
  const [openAddItemsDialog, setOpenAddItemsDialog] = useState(false);
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [uncategorizedItems, setUncategorizedItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    updateCategoryItems();
  }, [items, category.id]);

  const updateCategoryItems = () => {
    setCategoryItems(items.filter(item => item.category === category.id));
  };

  const fetchUncategorizedItems = async () => {
    try {
      const response = await api.get('/token/items/');
      const uncategorized = response.data.filter(item => item.category === null);
      setUncategorizedItems(uncategorized);
    } catch (error) {
      console.error('Error fetching uncategorized items:', error);
    }
  };

  const handleOpenProductsDialog = () => setOpenProductsDialog(true);
  const handleCloseProductsDialog = () => setOpenProductsDialog(false);

  const handleOpenAddItemsDialog = async (event) => {
    event.stopPropagation();
    setSelectedItems([]);
    await fetchUncategorizedItems();
    setOpenAddItemsDialog(true);
  };

  const handleCloseAddItemsDialog = () => {
    setOpenAddItemsDialog(false);
    setItemSearchTerm('');
    setSelectedItems([]);
  };

  const handleItemToggle = (item) => {
    setSelectedItems(prev => {
      const currentIndex = prev.findIndex(i => i.item_id === item.item_id);
      if (currentIndex === -1) {
        return [...prev, item];
      } else {
        return prev.filter(i => i.item_id !== item.item_id);
      }
    });
  };

  const handleAddItems = async () => {
    try {
      const updatedItems = [];

      for (const item of selectedItems) {
        const formData = new FormData();
        
        Object.keys(item).forEach(key => {
          if (key !== 'image') {
            formData.append(key, item[key]);
          }
        });
        
        formData.append('category', category.id);

        if (item.image instanceof File) {
          formData.append('image', item.image);
        }

        const response = await api.put(`/token/items/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedItems.push(response.data);
      }

      onItemsUpdated(updatedItems);
      handleCloseAddItemsDialog();
    } catch (error) {
      console.error('Error updating items:', error);
    }
  };

  const handleCardClick = () => {
    handleOpenProductsDialog();
  };

  const handleDeleteCategory = async () => {
    try {
      await api.delete(`/token/categories/${category.id}/`);
      onCategoryDeleted(category.id);
      setOpenProductsDialog(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const formData = new FormData();
      
      Object.keys(item).forEach(key => {
        if (key !== 'image') {
          formData.append(key, item[key] === null ? '' : item[key]);
        }
      });
      
      formData.append('category', '');

      if (item.image instanceof File) {
        formData.append('image', item.image);
      }

      const response = await api.put(`/token/items/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onItemsUpdated([response.data]);
      
      setCategoryItems(prevItems => prevItems.filter(i => i.item_id !== item.item_id));
    } catch (error) {
      console.error('Error removing item from category:', error);
    }
  };

  const getTopSellingProduct = () => {
    if (categoryItems.length === 0) return "No products";
    return categoryItems.reduce((max, item) => 
      (item.sold_quantity > max.sold_quantity) ? item : max
    ).name;
  };

  const sortedAndFilteredCategoryItems = useMemo(() => {
    let filteredItems = categoryItems.filter(item =>
      item.name.toLowerCase().includes(productSearchTerm.toLowerCase())
    );

    if (sortConfig.key !== null) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredItems;
  }, [categoryItems, productSearchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const availableItems = uncategorizedItems.filter(item => 
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

  return (
    <>
      <StyledCard onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
        <CardMedia
          component="img"
          height="180"
          image={"http://127.0.0.1:8000"+category.image}
          alt={category.name}
        />
        <StyledCardContent>
          <CategoryName variant="h5" component="div">
            {category.name}
          </CategoryName>
          <TopSellingBox>
            <TopSellingLabel>Top Selling Product</TopSellingLabel>
            <TopSellingProduct>{getTopSellingProduct()}</TopSellingProduct>
          </TopSellingBox>
          <ButtonContainer>
            <ProductCountButton variant="contained" onClick={(e) => {
              e.stopPropagation();
              handleOpenProductsDialog();
            }}>
              {categoryItems.length} Products
            </ProductCountButton>
            <AddItemsButton variant="contained" onClick={handleOpenAddItemsDialog}>
              Add Items
            </AddItemsButton>
          </ButtonContainer>
        </StyledCardContent>
      </StyledCard>

      {/* Products Dialog */}
      <Dialog open={openProductsDialog} onClose={handleCloseProductsDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{category.name} Products</Typography>
            <IconButton onClick={handleDeleteCategory} color="error">
              <DeleteIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Search Products"
            type="text"
            fullWidth
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'name'}
                      direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'}
                      onClick={() => requestSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'quantity'}
                      direction={sortConfig.key === 'quantity' ? sortConfig.direction : 'asc'}
                      onClick={() => requestSort('quantity')}
                    >
                      Quantity
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortConfig.key === 'selling_price'}
                      direction={sortConfig.key === 'selling_price' ? sortConfig.direction : 'asc'}
                      onClick={() => requestSort('selling_price')}
                    >
                      Price
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAndFilteredCategoryItems.map((item) => (
                  <TableRow key={item.item_id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell align="right">₹ {item.selling_price}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleDeleteItem(item)} size="small">
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductsDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Items Dialog */}
      <Dialog open={openAddItemsDialog} onClose={handleCloseAddItemsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Uncategorized Items to {category.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Search Uncategorized Items"
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
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {availableItems.map((item) => (
              <ListItem key={item.item_id} dense button onClick={() => handleItemToggle(item)}>
                <Checkbox
                  edge="start"
                  checked={selectedItems.some(i => i.item_id === item.item_id)}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText 
                  primary={item.name} 
                  secondary={`Quantity: ${item.quantity}, Price: ₹ ${item.selling_price}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddItemsDialog}>Cancel</Button>
          <Button 
            onClick={handleAddItems} 
            disabled={selectedItems.length === 0}
            sx={{
              background: 'linear-gradient(90deg, #D1EA67, #A6F15A)',
              color: '#232619',
              '&:hover': {
                background: 'linear-gradient(90deg, #D1EA67, #A6F15A)',
              },
            }}
          >
            Add Selected Items
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryCard;