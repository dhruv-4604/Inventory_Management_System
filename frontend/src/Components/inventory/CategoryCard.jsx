// CategoryCard.jsx
import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
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

const CategoryCard = ({ category, items, onItemsUpdated }) => {
  const [openProductsDialog, setOpenProductsDialog] = useState(false);
  const [openAddItemsDialog, setOpenAddItemsDialog] = useState(false);
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const categoryItems = items.filter(item => item.category === category.id);
  const uncategorizedItems = items.filter(item => item.category === null);

  const availableItems = uncategorizedItems.filter(item => 
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

  const handleOpenProductsDialog = () => setOpenProductsDialog(true);
  const handleCloseProductsDialog = () => setOpenProductsDialog(false);

  const handleOpenAddItemsDialog = () => {
    setSelectedItems([]);
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
        item.category = category.id;
        const response = await api.put(`/token/items/`, item);
        updatedItems.push(response.data);
      }

      onItemsUpdated(updatedItems);
      handleCloseAddItemsDialog();
    } catch (error) {
      console.error('Error updating items:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <>
      <StyledCard>
        <CardMedia
          component="img"
          height="180"
          image={category.image}
          alt={category.name}
        />
        <StyledCardContent>
          <CategoryName variant="h5" component="div">
            {category.name}
          </CategoryName>
          <TopSellingBox>
            <TopSellingLabel>Top Selling Product</TopSellingLabel>
            <TopSellingProduct>&nbsp;{category.topSelling}</TopSellingProduct>
          </TopSellingBox>
          <ButtonContainer>
            <ProductCountButton variant="contained" onClick={handleOpenProductsDialog}>
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
        <DialogTitle>{category.name} Products ({categoryItems.length})</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryItems.map((item) => (
                  <TableRow key={item.item_id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell align="right">${item.selling_price}</TableCell>
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
                  secondary={`Quantity: ${item.quantity}, Price: $${item.selling_price}`}
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