import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Rating, 
  Grid,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Dummy review data
const reviews = [
  {
    id: 1,
    name: 'John Doe',
    rating: 4.5,
    date: '2025-08-05',
    comment: 'The fabric quality is amazing! The dress fits perfectly and looks even better than in the pictures. Very satisfied with my purchase.',
    avatar: 'JD'
  },
  {
    id: 2,
    name: 'Jane Smith',
    rating: 5,
    date: '2025-08-03',
    comment: 'Absolutely love this product! The design is beautiful and the material is so comfortable. Will definitely buy again!',
    avatar: 'JS'
  },
  {
    id: 3,
    name: 'Alex Johnson',
    rating: 4,
    date: '2025-08-01',
    comment: 'Good quality fabric and nice stitching. The color is exactly as shown. Very happy with my purchase.',
    avatar: 'AJ'
  },
  {
    id: 4,
    name: 'Alex Johnson',
    rating: 4,
    date: '2025-08-01',
    comment: 'Good quality fabric and nice stitching. The color is exactly as shown. Very happy with my purchase.',
    avatar: 'AJ'
  }
];

const StyledCard = styled(Card)(({ theme }) => ({
  width: 350,
  height: 200,
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px 0 rgba(0,0,0,0.15)'
  }
}));

const ReviewAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  backgroundColor: theme.palette.primary.main,
  fontSize: '1.25rem',
  fontWeight: 'bold'
}));

const ReviewDate = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  marginBottom: theme.spacing(1)
}));

const ReviewCard = ({ review }) => (
  <StyledCard>
    <CardContent sx={{ display: 'flex',flexDirection: 'column', alignItems: 'center', justifyContent: 'center',   }}>
      <Box display="flex" gap={2}>
        <Box>
          <ReviewAvatar>{review.avatar}</ReviewAvatar>
        </Box>
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.name}
            </Typography>
            <Rating 
              value={review.rating} 
              precision={0.5} 
              readOnly 
              size="small"
              sx={{ color: '#ffc107' }}
            />
          </Box>
          <ReviewDate>{review.date}</ReviewDate>
          <Typography variant="body2" color="text.secondary">
            {review.comment}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </StyledCard>
);

const ReviewSection = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4, mx: 'auto' }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ 
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Customer Reviews
      </Typography>
      <Box display="flex" flexDirection="row" gap={3} justifyContent="center" alignItems="center" sx={{ paddingLeft: '50px', paddingRight: '50px' }}>
        {reviews.map((review) => (
          <Box key={review.id} mx={1}>
            <ReviewCard review={review} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ReviewSection;