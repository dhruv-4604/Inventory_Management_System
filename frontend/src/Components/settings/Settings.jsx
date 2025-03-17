import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, Grid, Avatar, Tabs, Tab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton 
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import api from '../../api';
import Sidebar from '../navigation/SideBar';
import { styled } from "@mui/system";

function Settings() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone_number: '',
    company_name: '',
    gst_number: '',
    bank_name: '',
    bank_account_number: '',
    ifsc_code: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    company_logo: null,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await api.get('/token/user/');
        const companyRes = await api.get('/company/');
        setUserData({ ...userRes.data, ...companyRes.data });
        if (companyRes.data.company_logo) {
          setLogoPreview(`https://backend.supplysync.online${companyRes.data.company_logo}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prevData => ({ ...prevData, company_logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePersonalDetailsSubmit = async (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  const handleCompanyDetailsSubmit = async (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      let res;
      if (activeTab === 0) {
        // Update personal details
        res = await api.put('/token/user/', {
          name: userData.name,
          phone_number: userData.phone_number,
          password: password
        });
      } else {
        // Update company details
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
          if (key === 'company_logo' && userData[key] instanceof File) {
            formData.append(key, userData[key]);
          } else if (key !== 'company_logo') {
            formData.append(key, userData[key]);
          }
        });
        res = await api.put('/company/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setUserData(prevData => ({ ...prevData, ...res.data }));
      setOpenDialog(false);
      setPassword('');
      setError('');
      alert(activeTab === 0 ? 'Personal details updated successfully!' : 'Company details updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Failed to update details. Please try again.');
    }
  };

  const SquareImage = styled('img')({
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '2px solid #000',
  });
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Paper elevation={3} sx={{ p: 3, mt: 2, width: '100%', maxWidth: 1200 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Personal Details" />
              <Tab label="Company Details" />
            </Tabs>
          </Box>
          <form onSubmit={activeTab === 0 ? handlePersonalDetailsSubmit : handleCompanyDetailsSubmit}>
            <Box sx={{ mt: 3 }}>
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone_number"
                      value={userData.phone_number}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              )}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 3, position: 'relative' }}>
                    <SquareImage
                      alt="Company Logo"
                      src={logoPreview || "https://backend.supplysync.online/media/default_logo.png"}
                      sx={{ width: 100, height: 100 }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="icon-button-file"
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        sx={{ position: 'absolute', bottom: 70, right:500}}
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="company_name"
                      value={userData.company_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="GST Number"
                      name="gst_number"
                      value={userData.gst_number}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      name="bank_name"
                      value={userData.bank_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bank Account Number"
                      name="bank_account_number"
                      value={userData.bank_account_number}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="IFSC Code"
                      name="ifsc_code"
                      value={userData.ifsc_code}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={userData.city}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={userData.state}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Pincode"
                      name="pincode"
                      value={userData.pincode}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary">
                {activeTab === 0 ? 'Save Personal Details' : 'Save Company Details'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your password to confirm the changes.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;