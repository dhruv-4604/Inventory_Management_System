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

function NewItemModal({ open, onClose, onSave }) {
  const [itemData, setItemData] = useState({
    type: 'Goods',
    name: '',
    sku: '',
    unit: '',
    returnable: false,
    dimensions: '',
    weight: '',
    brand: '',
    manufacturer: '',
    mpn: '',
    upc: '',
    isbn: '',
    ean: '',
    description: '',
    rate: '',
  });
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
    const files = event.target.files;
    console.log(files);
    // Handle file upload logic here
  };

  const handleSave = () => {
    onSave(itemData);
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
            <TextField
              fullWidth
              margin="normal"
              label="SKU"
              name="sku"
              value={itemData.sku}
              onChange={handleChange}
            />
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
            <TextField
              fullWidth
              margin="normal"
              label="Dimensions (Length X Width X Height)"
              name="dimensions"
              value={itemData.dimensions}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Weight"
              name="weight"
              value={itemData.weight}
              onChange={handleChange}
            />
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
            <TextField
              fullWidth
              margin="normal"
              label="MPN"
              name="mpn"
              value={itemData.mpn}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="UPC"
              name="upc"
              value={itemData.upc}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="ISBN"
              name="isbn"
              value={itemData.isbn}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="EAN"
              name="ean"
              value={itemData.ean}
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
            <TextField
              fullWidth
              margin="normal"
              label="Rate"
              name="rate"
              value={itemData.rate}
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