import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Checkbox, 
  FormControlLabel, 
  Link,
  Container,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import googleIcon from './google_icon.png'
import illustraion from './Illustration_Image.png'
import mainlogo from './Components/logo.png'

// Assuming you've imported your CSS file with custom font definitions
import './fonts.css';

// Custom styled components
const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#F5F5F5',
    '& fieldset': {
      borderColor: '#E0E0E0',
    },
    '&:hover fieldset': {
      borderColor: '#B4D334',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#B4D334',
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'ClashGrotesk-Medium',
  },
});

const StyledButton = styled(Button)({
  borderRadius: '8px',
  textTransform: 'none',
  padding: '10px 0',
  fontFamily: 'ClashGrotesk-Medium',
  fontWeight: 500,
});

const SignInPage = () => {
  return (
    <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <img src={mainlogo} alt="SupplySync" height="30" />
      </Box>
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', pl: { xs: 2, md: 8 } }}>
          <Typography variant="h4" component="h1" sx={{  mb: 1, fontFamily: 'ClashGrotesk-semibold, Arial, sans-serif' }}>
            Welcome Back!
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', fontFamily: 'ClashGrotesk-Medium, Arial, sans-serif', fontWeight: 400 }}>
            Sign-In to continue.
          </Typography>
          <Box component="form" noValidate sx={{ width: '100%', maxWidth: 400 }}>
            <StyledTextField
              fullWidth
              placeholder="Enter Email Id"
              InputProps={{
                startAdornment: <EmailIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <StyledTextField
              fullWidth
              type="password"
              placeholder="Enter Password"
              InputProps={{
                startAdornment: <LockIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={<Checkbox sx={{ color: '#B4D334', '&.Mui-checked': { color: '#B4D334' } }} />}
                label={<Typography sx={{ fontFamily: 'ClashGrotesk-Medium, Arial, sans-serif' }}>Remember me?</Typography>}
              />
              <Link href="#" sx={{ color: '#B4D334', textDecoration: 'none', fontFamily: 'ClashGrotesk-Medium' }}>
                Forget Password?
              </Link>
            </Box>
            <StyledButton
              fullWidth
              variant="contained"
              sx={{ 
                mb: 2, 
                backgroundColor: '#B4D334', 
                '&:hover': { backgroundColor: '#A2BF30' },fontFamily: 'ClashGrotesk-Semibold',
              }}
            >
              Login
            </StyledButton>
            <StyledButton
              fullWidth
              variant="outlined"
              startIcon={<img src={googleIcon} alt="Google" width="18" height="18" />}
              sx={{ 
                mb: 2, 
                color: '#B4D334', 
                borderColor: '#B4D334',
                '&:hover': { borderColor: '#A2BF30' },fontFamily: 'ClashGrotesk-Semibold',
              }}
            >
              Login with Google
            </StyledButton>
            <Typography variant="body2" align="center" sx={{ fontFamily: 'ClashGrotesk-Medium' }}>
              Don't have an account? <Link href="#" sx={{ color: '#B4D334', textDecoration: 'none' }}>Create account</Link>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
          <img src={illustraion} alt="Supply Chain Illustration" style={{ maxWidth: '100%', height: 'auto' }} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignInPage;