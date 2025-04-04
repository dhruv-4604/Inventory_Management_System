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
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

function EditItemModal({ open, onClose, item, onSave, categories = [] }) {
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
      [name]: value === '' ? null : value // Set to null if empty string
    }));
  };

  const handleCategoryChange = (event, newValue) => {
    console.log('New category value:', newValue);
    setItemData(prevData => {
      const updatedData = {
        ...prevData,
        category: newValue ? newValue.id : null
      };
      console.log('Updated itemData:', updatedData);
      return updatedData;
    });
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
    // Validate required fields
    const requiredFields = ['name', 'brand', 'description', 'purchase_price', 'selling_price', 'quantity'];
    const missingFields = requiredFields.filter(field => !itemData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const formData = new FormData();
      console.log(itemData)
      for(const x of categories){
        console.log(x)
        if(x.name===itemData.category){
          
          itemData.category=x.id
        }
      }
      if(itemData.categories=='-'){
        itemData.categories="Hoo"
      }
      const dataToSend = { ...itemData, item_id: itemData.item_id }; // Ensure item_id is included
     
     
      for (const key in dataToSend) {
        if (key === 'image') {
          if (dataToSend[key] instanceof File) {
            formData.append('image', dataToSend[key]);
          } else if (dataToSend[key] === null) {
            // If image is explicitly set to null, append an empty string to indicate removal
            formData.append('image', '');
          }
          // If image is undefined (not changed), don't append anything
        } else {
          formData.append(key, dataToSend[key] === null ? '' : dataToSend[key]);
        }
      }

      // Log the FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
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
      alert('Error updating item. Please try again.');
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
              required
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
              required
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
              isOptionEqualToValue={(option, value) => option && value && option.id === value.id}
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
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Selling Price"
              name="selling_price"
              value={itemData.selling_price || ''}
              onChange={handleChange}
              type="number"
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Quantity"
              name="quantity"
              value={itemData.quantity || ''}
              onChange={handleChange}
              type="number"
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Restock Quantity"
              name="reorder_point"
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
        <Button 
          onClick={handleSave} 
          variant="contained" 
          sx={{ 
            background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
            color: '#232619',
            boxShadow: 'none',
            '&:hover': {
              background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
              boxShadow: 'none'
            },
            textTransform: 'none',
            fontWeight: 'semibold',
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditItemModal;
