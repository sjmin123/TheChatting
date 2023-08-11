import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#4e586e',
    color: '#4e586e',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));


export default function BadgeAvatars(data) {
  return (

    //넘어갔을 때 스크롤바 없애기
    <Grid container spacing={2} sx={{ maxWidth: '500px', alignItems: 'flex-start', margin: '15px', height: '73px' }}>
      {data.data.getOnlineFriends.map((nickname) => (
        <Grid item key={nickname}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </StyledBadge>
          <Typography align="center" sx={{ fontSize: 11 }}>
            {nickname}
          </Typography>
        </Grid>
      ))}
    </Grid>
    
  );
}