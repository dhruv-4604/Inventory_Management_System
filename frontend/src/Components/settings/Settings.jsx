import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, Grid, Avatar, Tabs, Tab 
} from '@mui/material';
import api from '../../api';
import Sidebar from '../navigation/SideBar';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

function Settings() {
  const [userData, setUserData] = useState({
    // Personal details
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '', // Added mobile number
    // Company details
    company_name: '',
    gst_number: '',
    bank_name: '',
    bank_account_number: '',
    ifsc_code: '',
    address: '', // Moved to company details
    city: '', // Moved to company details
    state: '', // Moved to company details
    pincode: '', // Moved to company details
    profile_picture: null,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await api.get('/token/user/');
        setUserData(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserData({ ...userData, profile_picture: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfilePicUpload = () => {
    document.getElementById('profile-pic-input').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/token/user/', userData);
      setUserData(res.data);
      alert('Details updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Failed to update details. Please try again.');
    }
  };

  const handleChangePassword = () => {
    // Implement password change logic here
    console.log('Change password clicked');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Settings</Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              centered
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Personal Details" />
              <Tab label="Company Details" />
            </Tabs>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mt: 3 }}>
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Avatar 
                      sx={{ width: 100, height: 100, fontSize: 40, mb: 2 }}
                      alt={userData.full_name}
                      src="/path-to-profile-image.jpg"
                    >
                      {userData.full_name}
                    </Avatar>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="full_name"
                      value={userData.full_name}
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      name="mobile_number"
                      value={userData.mobile_number}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              )}
              {activeTab === 1 && (
                <Grid container spacing={3}>
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
                Save Changes
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default Settings;