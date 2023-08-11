import * as React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function ButtonAppBar(data) {
  console.log(data);
  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '500px' }}>
      <Grid item alignItems="left" xs={2.5}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ marginLeft: '1px' }}
          component={Link} // Link 컴포넌트 사용
          to={data.one} // 이동할 경로 설정
        >
          <MenuIcon sx={{ color: '#4e586e' }} />
        </IconButton>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" component="div" sx={{ textAlign: 'center', textDecoration: 'none' }}>
          <Link to={`/`} style={{ textDecoration: 'none', color: 'black' }}>
            The Chatting
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={0.5} alignItems="right">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          component={Link} // Link 컴포넌트 사용
          to="/addfriend" // 이동할 경로 설정
        >
          <PersonAddIcon sx={{ color: '#4e586e' }} />
        </IconButton>
      </Grid>
      <Grid item xs={1}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          component={Link} // Link 컴포넌트 사용
          to='/friendlist' // 이동할 경로 설정
        >
          <CreateIcon sx={{ color: '#4e586e' }} />
        </IconButton>
      </Grid>
    </Grid>
  );
}