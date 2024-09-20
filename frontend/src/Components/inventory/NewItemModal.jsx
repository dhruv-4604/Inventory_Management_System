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
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';
import { styled } from '@mui/material/styles';

// Custom styled button with green gradient
const GreenGradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
  color: '#232619',
  boxShadow: 'none',
  '&:hover': {
    background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
    boxShadow: 'none',
  },
  textTransform: 'none',
  fontWeight: 'semibold',
}));

function NewItemModal({ open, onClose, onSave, categories }) {
  const [itemData, setItemData] = useState({
    name: '',
    brand: '',
    description: '',
    category: null,
    purchase_price: '',
    selling_price: '',
    quantity: '',
    reorder_point: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
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
    const newErrors = {};
    const requiredFields = ['name', 'brand', 'description', 'purchase_price', 'selling_price', 'quantity'];
    
    requiredFields.forEach(field => {
      if (!itemData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
      setItemData({
        name: '',
        brand: '',
        description: '',
        category: null,
        purchase_price: '',
        selling_price: '',
        quantity: '',
        reorder_point: '',
        image: null,
      });
      onClose();
    } catch (error) {
      alert(error)
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        New Item
        <IconButton onClick={onClose} size="small">
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
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Brand"
              name="brand"
              value={itemData.brand}
              onChange={handleChange}
              required
              error={!!errors.brand}
              helperText={errors.brand}
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
              required
              error={!!errors.description}
              helperText={errors.description}
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
              required
              error={!!errors.purchase_price}
              helperText={errors.purchase_price}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Selling Price"
              name="selling_price"
              value={itemData.selling_price}
              onChange={handleChange}
              type="number"
              required
              error={!!errors.selling_price}
              helperText={errors.selling_price}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Quantity"
              name="quantity"
              value={itemData.quantity}
              onChange={handleChange}
              type="number"
              required
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Restock Quantity (Optional)"
              name="reorder_point"
              value={itemData.reorder_point}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                border: '1px dashed grey',
                borderRadius: '4px',
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
              {itemData.image ? (
                <>
                  <Typography>Selected file: {itemData.image.name}</Typography>
                  {itemData.image.type.startsWith('image/') && (
                    <img
                      src={URL.createObjectURL(itemData.image)}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '10px' }}
                    />
                  )}
                </>
              ) : (
                <>
                  <Typography>Drag image here</Typography>
                  <Typography>or</Typography>
                  <Typography color="primary" sx={{ cursor: 'pointer' }}>
                    Browse image
                  </Typography>
                </>
              )}
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
        <Button onClick={onClose} sx={{ color: '#232619' }}>Cancel</Button>
        <GreenGradientButton onClick={handleSave}>Save</GreenGradientButton>
      </DialogActions>
    </Dialog>
  );
}

export default NewItemModal;