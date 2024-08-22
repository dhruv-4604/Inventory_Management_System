// CategoryCard.jsx
import React from 'react';
import {
  Card, CardMedia, CardContent, Typography, Box, Button,
  styled
} from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 280,
  borderRadius: '8px',
  overflow: 'hidden',
 border:'1.5px solid #AEAEAE',
 boxShadow:'none'
}));

const StyledCardContent = styled(CardContent)({
  padding: '16px',
});

const CategoryName = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '12px',
});

const TopSellingBox = styled(Box)({
  borderRadius:'6px',
  display: 'flex',
  marginBottom: '10px',
  fontWeight:'400',
  
});

const TopSellingLabel = styled(Typography)({
  backgroundColor: '#2E2E2E',
  color: 'white',
  padding: '0px 12px',
  fontSize: '12px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  zIndex:1,
});

const TopSellingProduct = styled(Typography)({
  marginLeft:'-6px',
  backgroundColor: '#F0F0F0',
  color: '#333',
  padding: '6px 12px',
  fontSize: '12px',
  flexGrow: 1,
  border:'1px solid black',
  borderTopRightRadius: '8px',
  borderBottomRightRadius: '8px',
  display: 'flex',
  alignItems: 'center',
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
});

const StyledButton = styled(Button)({
  flex: 1,
  borderRadius: '6px',
  padding: '5px 0',
  marginTop:'12px',
  fontSize: '14px',
  textTransform: 'none',
  boxShadow:'none',
  '&:hover':{boxShadow:'none'}
});

const ProductCountButton = styled(StyledButton)({
  backgroundColor: '#2E2E2E',
  color: 'white',
  '&:hover': {
    backgroundColor: '#2E2E2E',
  },
});

const AddItemsButton = styled(StyledButton)({
  background: 'linear-gradient(90deg, #D1EA67, #A6F15A)',
  color: '#232619',
  '&:hover': {
    background: 'linear-gradient(90deg, #D1EA67, #A6F15A)',
  },
});

const CategoryCard = ({ category }) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="180"
        image={category.image}
        alt={category.name}
        
      />
      <StyledCardContent>
        <CategoryName variant="h5" component="div">
          {category.name}
        </CategoryName>
        <TopSellingBox>
          <TopSellingLabel>Top Selling Product</TopSellingLabel>
          <TopSellingProduct>&nbsp;{category.topSelling}</TopSellingProduct>
        </TopSellingBox>
        <ButtonContainer>
          <ProductCountButton variant="contained">
            {category.productCount} Products
          </ProductCountButton>
          <AddItemsButton variant="contained">
            Add Items
          </AddItemsButton>
        </ButtonContainer>
      </StyledCardContent>
    </StyledCard>
  );
};

export default CategoryCard;