import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Checkbox, 
  FormControlLabel, 
  Container,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import googleIcon from './google_icon.png';
import illustration from './Illustration_Image.png';
import mainLogo from './Components/logo.png';
import { Link } from 'react-router-dom';
import './fonts.css';

// Styled components (reused from SignInPage)
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#F5F5F5',
    height: '45px',
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
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: '45px',
  borderRadius: '9px',
  textTransform: 'none',
  fontSize: '18px',
  fontFamily: 'ClashGrotesk-Semibold',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}));

const GradientBorderButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #BDD757, #94C848) border-box',
  border: '1.8px solid transparent',
  borderRadius: '9px',
  '&:hover': {
    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #BDD757, #94C848) border-box',
    border: 'solid 1.8px #94C848',
  },
}));

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <img src={mainLogo} alt="SupplySync" height="30" />
      </Box>
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', pl: { xs: 2, md: 8 } }}>
          <Typography variant="h4" component="h1" sx={{ mb: 1, fontFamily: 'ClashGrotesk-semibold, Arial, sans-serif' }}>
            Let's get you started
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', fontFamily: 'ClashGrotesk-Medium, Arial, sans-serif', fontWeight: 400 }}>
            Enter the details to get going
          </Typography>
          <Box component="form" noValidate sx={{ width: '100%', maxWidth: 400 }}>
            <StyledTextField 
              fullWidth
              placeholder="Enter Email Id"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: <EmailIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <StyledTextField
              fullWidth
              type="password"
              placeholder="Create Password"
              InputProps={{
                startAdornment: <LockIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <StyledTextField
              fullWidth
              placeholder="Enter Company Name"
              InputProps={{
                startAdornment: <BusinessIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <StyledTextField
              fullWidth
              placeholder="Enter Company Phone"
              InputProps={{
                startAdornment: <PhoneIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Checkbox sx={{ color: '#97C949', '&.Mui-checked': { color: '#97C949' } }} />}
              label={
                <Typography sx={{ fontFamily: 'ClashGrotesk-Medium, Arial, sans-serif', fontSize: '0.875rem' }}>
                  I agree to the <Link href="#" sx={{ color: '#97C949' }}>Terms of Service</Link> and <Link href="#" sx={{ color: '#97C949' }}>Privacy Policy</Link>
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            <StyledButton
              fullWidth
              variant="contained"
              component={Link}
              to='/home'
              sx={{ 
                mb: 2, 
                background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
                color: '#232619',
              }}
            >
              Create Account
            </StyledButton>
            <GradientBorderButton
              fullWidth
              variant="outlined"
            

              startIcon={<img src={googleIcon} alt="Google" width="18" height="18" />}
              sx={{ 
                mb: 2, 
                height:'45px',
                color: '#94C848', textTransform:'none',fontFamily: 'ClashGrotesk-semibold', fontSize:'17px' 
              }}
            >
              Signup using Google
            </GradientBorderButton>
            <Typography variant="body2" align="center" sx={{ fontFamily: 'ClashGrotesk-Medium' }}>
              Already have an account? <Link to="/" sx={{ color: '#97C949', textDecoration: 'none' }}>Sign In</Link>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
          <img src={illustration} alt="Supply Chain Illustration" style={{ maxWidth: '100%', height: 'auto' }} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUpPage;