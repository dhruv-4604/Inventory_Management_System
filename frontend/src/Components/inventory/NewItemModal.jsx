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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';
function NewItemModal({ open, onClose, onSave }) {
  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    selling_price: '',
    pruchase_price: '',
    image:null,
  });
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setItemData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0])

  };

  const handleSave = async() => {
    try {

      const res = await api.post('/token/items/',{name:itemData.name,description:itemData.description,selling_price:itemData.selling_price,purchase_price:itemData.purchase_price,image:image}, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
 
   
      
  } catch (error) {
      alert(error)
  }
    setItemData({
      name: '',
      description: '',
      selling_price: '',
      pruchase_price: '',
    })
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
          <Grid item xs={12}>
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup row name="type" value={itemData.type} onChange={handleChange}>
                <FormControlLabel value="Goods" control={<Radio />} label="Goods" />
                <FormControlLabel value="Service" control={<Radio />} label="Service" />
              </RadioGroup>
            </FormControl>
          </Grid>
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
            {/* <TextField
              fullWidth
              margin="normal"
              label="SKU"
              name="sku"
              value={itemData.sku}
              onChange={handleChange}
            /> */}
            <FormControl fullWidth margin="normal">
              <Select
                value={itemData.unit}
                onChange={handleChange}
                name="unit"
                displayEmpty
                required
              >
                <MenuItem value="" disabled>Select or type to add</MenuItem>
                <MenuItem value="pcs">Pieces</MenuItem>
                <MenuItem value="kg">Kilograms</MenuItem>
                {/* Add more units as needed */}
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox checked={itemData.returnable} onChange={handleChange} name="returnable" />}
              label="Returnable Item"
            />
            {/* <TextField
              fullWidth
              margin="normal"
              label="Dimensions (Length X Width X Height)"
              name="dimensions"
              value={itemData.dimensions}
              onChange={handleChange}
            /> */}
            {/* <TextField
              fullWidth
              margin="normal"
              label="Weight"
              name="weight"
              value={itemData.weight}
              onChange={handleChange}
            /> */}
            <TextField
              fullWidth
              margin="normal"
              label="Brand"
              name="brand"
              value={itemData.brand}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Manufacturer"
              name="manufacturer"
              value={itemData.manufacturer}
              onChange={handleChange}
            />
            {/* <TextField
              fullWidth
              margin="normal"
              label="MPN"
              name="mpn"
              value={itemData.mpn}
              onChange={handleChange}
            /> */}
            {/* <TextField
              fullWidth
              margin="normal"
              label="UPC"
              name="upc"
              value={itemData.upc}
              onChange={handleChange}
            /> */}
            {/* <TextField
              fullWidth
              margin="normal"
              label="ISBN"
              name="isbn"
              value={itemData.isbn}
              onChange={handleChange}
            /> */}
            {/* <TextField
              fullWidth
              margin="normal"
              label="EAN"
              name="ean"
              value={itemData.ean}
              onChange={handleChange}
            /> */}
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
            <TextField
              fullWidth
              margin="normal"
              label="Rate"
              name="selling_price"
              value={itemData.selling_price}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Purchase Rate"
              name="purchase_price"
              value={itemData.purchase_price}
              onChange={handleChange}
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
              <Typography>Drag image(s) here</Typography>
              <Typography>or</Typography>
              <Typography color="primary" sx={{ cursor: 'pointer' }}>
                Browse images
              </Typography>
              <Typography variant="caption">You can add up to 15 images, each not exceeding 5 MB.</Typography>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                multiple
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