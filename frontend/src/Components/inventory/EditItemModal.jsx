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
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

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
    setItemData(prevData => ({
      ...prevData,
      image: file
    }));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setItemData(prevData => ({
      ...prevData,
      image: null
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in itemData) {
        if (key === 'image') {
          if (itemData[key] instanceof File) {
            formData.append('image', itemData[key]);
          } else if (itemData[key] === null) {
            // If image is explicitly set to null, append an empty string to indicate removal
            formData.append('image', '');
          }
          // If image is undefined (not changed), don't append anything
        } else {
          formData.append(key, itemData[key]);
        }
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
              value={itemData.reorder_point || ''}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternateIcon />}
                onClick={handleBrowseClick}
              >
                {image ? 'Change Image' : 'Add Image'}
              </Button>
              {image && (
                <>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {image instanceof File ? image.name : 'Current image'}
                  </Typography>
                  <IconButton onClick={handleRemoveImage} color="error" sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
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

export default EditItemModal;
