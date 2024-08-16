import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledMain = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: 0,
  marginTop: 64, // height of the AppBar
}));

function MainContent() {
  return (
    <StyledMain>
      <Typography paragraph>
        Main content goes here
      </Typography>
    </StyledMain>
  );
}

export default MainContent;