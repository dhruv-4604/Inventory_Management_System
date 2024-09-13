import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';

function EditItemModal({ open, onClose, item, onSave }) {
  const [itemData, setItemData] = useState({});
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (item) {
      setItemData({ ...item });
      setImage(item.image);
    }
  }, [item]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItemData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in itemData) {
        if (key !== 'image') {
          formData.append(key, itemData[key]);
        }
      }
      if (image) {
        formData.append('image', image);
      }

      const res = await api.put('/token/items/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSave(res.data);
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Item
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
              value={itemData.name || ''}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Brand"
              name="brand"
              value={itemData.brand || ''}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={itemData.description || ''}
              onChange={handleChange}
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Category"
              name="category"
              value={itemData.category || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Purchase Rate"
              name="purchase_price"
              value={itemData.purchase_price || ''}
              onChange={handleChange}
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Selling Price"
              name="selling_price"
              value={itemData.selling_price || ''}
              onChange={handleChange}
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Quantity"
              name="quantity"
              value={itemData.quantity || ''}
              onChange={handleChange}
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Restock Quantity"
              name="restock_quantity"
              value={itemData.restock_quantity || ''}
              onChange={handleChange}
              type="number"
            />
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

export default EditItemModal;
