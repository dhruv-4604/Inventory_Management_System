import React, { useState } from 'react';
import api from '../../api'
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

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
import PersonIcon from '@mui/icons-material/Person';
import googleIcon from '../../assets/google_icon.png';
import illustration from '../../assets/Illustration_Image.png';
import mainLogo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import '../../fonts.css';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

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

  const validatePhoneNumber = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const handlePhoneChange = (event) => {
    const newPhone = event.target.value;
    setPhonenumber(newPhone);
    if (newPhone && !validatePhoneNumber(newPhone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    // Clear local storage
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);

    try {
      const res = await api.post('/register/', {
        email: email,
        password: password,
        name: name,
        phone_number: phonenumber
      });

      // If registration is successful, you might want to automatically log the user in
      navigate("/signin");
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(Object.values(error.response.data).join(' '));
      } else {
        setFormError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
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
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', maxWidth: 400 }} >
            <StyledTextField 
              fullWidth
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
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
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Create Password"
              InputProps={{
                startAdornment: <LockIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <StyledTextField
              fullWidth
              placeholder="Enter Phone Number"
              value={phonenumber}
              onChange={handlePhoneChange}
              error={!!phoneError}
              helperText={phoneError}
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
              type="submit"
            
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
          <Box textAlign='center' color='#d32f2f' paddingBottom={2}>{formError}</Box>
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