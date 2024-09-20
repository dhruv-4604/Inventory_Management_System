// ItemDetailView.js
import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from "../../api";
import EditItemModal from './EditItemModal';
import NoProductImage from '../../assets/Noproduct_itempreview.png';

function ItemDetailView({ open, onClose, item, onItemDeleted, onItemUpdated, categories }) {
  const fileInputRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    // Handle the selected files here
    console.log(files);
    // You would typically upload these files to your server or handle them as needed
  };

  const handleDeleteItem = async () => {
    try {
      await api.delete(`/token/items/delete/${item.item_id}`);
      onClose();
      onItemDeleted(item.item_id);
    } catch (error) {
      console.error('Error deleting item:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditSave = (updatedItem) => {
    onItemUpdated(updatedItem);
    setEditModalOpen(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{item.name}</Typography>
          <Box>
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDeleteItem} color="error">
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="subtitle1" color="textSecondary">
          {item.sku}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Item Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Name</Typography>
                <Typography>{item.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Brand</Typography>
                <Typography>{item.brand || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Category</Typography>
                <Typography>{item.category || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Quantity</Typography>
                <Typography>{item.quantity}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Reorder Point</Typography>
                <Typography>{item.reorder_point}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Description</Typography>
                <Typography>{item.description}</Typography>
              </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Sales Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Selling Price</Typography>
                <Typography>{item.selling_price}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Purchase Price</Typography>
                <Typography>{item.purchase_price}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={item.image ? `http://127.0.0.1:8000${item.image}` : NoProductImage}
                alt={item.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 300,
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom:'40px'
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <EditItemModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={item}
        onSave={handleEditSave}
        categories={categories}
      />
    </Dialog>
  );
}

export default ItemDetailView;