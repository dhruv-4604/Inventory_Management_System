// NewItemModal.js
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Grid,
  Typography,
  Box,
  IconButton,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';
function NewItemModal({ open, onClose, onSave, categories }) {
  const [itemData, setItemData] = useState({
    name: '',
    brand: '',
    description: '',
    category: null,
    purchase_price: '',
    selling_price: '',
    quantity: '',
    restock_quantity: '',
    image: null,
  });
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setItemData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (event, newValue) => {
    setItemData(prevData => ({
      ...prevData,
      category: newValue ? newValue.id : null
    }));
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setItemData(prevData => ({
      ...prevData,
      image: file
    }));
  };

  const handleSave = async() => {
    try {
      const formData = new FormData();
      for (const key in itemData) {
        if (key !== 'image' && itemData[key] !== null) {
          formData.append(key, itemData[key]);
        }
      }
      if (itemData.image) {
        formData.append('image', itemData.image);
      }

      const res = await api.post('/token/items/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onSave(res.data);
    } catch (error) {
      alert(error)
    }
    setItemData({
      name: '',
      brand: '',
      description: '',
      category: null,
      purchase_price: '',
      selling_price: '',
      quantity: '',
      restock_quantity: '',
      image: null,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        New Item
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={itemData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Brand"
              name="brand"
              value={itemData.brand}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={itemData.description}
              onChange={handleChange}
              multiline
              rows={2}
            />
            <Autocomplete
              fullWidth
              options={categories}
              getOptionLabel={(option) => option.name}
              value={categories.find(cat => cat.id === itemData.category) || null}
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category (Optional)"
                  margin="normal"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Purchase Rate"
              name="purchase_price"
              value={itemData.purchase_price}
              onChange={handleChange}
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Selling Price"
              name="selling_price"
              value={itemData.selling_price}
              onChange={handleChange}
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Quantity"
              name="quantity"
              value={itemData.quantity}
              onChange={handleChange}
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Restock Quantity (Optional)"
              name="restock_quantity"
              value={itemData.restock_quantity}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                border: '1px dashed grey',
                height: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                cursor: 'pointer',
                mt: 2,
              }}
              onClick={handleBrowseClick}
            >
              <Typography>Drag image here</Typography>
              <Typography>or</Typography>
              <Typography color="primary" sx={{ cursor: 'pointer' }}>
                Browse image
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewItemModal;