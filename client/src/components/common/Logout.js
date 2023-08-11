import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

export const LOGOUT = gql`
mutation Mutation {
  logout
}
`;

const Logout = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [out, { data, loading, error }] = useMutation(LOGOUT);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error:)</div>;
  }

  try {
    const onSubmit = async (e) => {
      await out();
      localStorage.setItem('token', '');
      cookies.remove('refreshToken', { path: '/' });
      navigate('/login'); // 리다이렉트할 경로 설정
      window.location.reload();
    };

    return (
      <Box
        sx={{
          width: '500px',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent: 'center',
          justifyContent: 'center',
          margin: '0 auto',

          padding: '40px',
          paddingTop: '20px',
          paddingBottom: '20px',
          // backgroundColor: '#eefaf2',
          borderRadius: '10px',
          backgroundColor: '#fcfcfc',
          border: "1px solid gray",
          boxShadow: '0px 4px 10px rgba(81, 75, 58, 0.222)', // 그림자 추가
          // height:'60px'
        }}>
        <Stack spacing={2} direction="row">
          <Button variant="outlined" onClick={onSubmit} sx={{ borderColor: 'gray', color: "gray" }}>logout</Button>
        </Stack>
      </Box>
    );
  } catch (error) {
    return <p>Error :(</p>
  }
}

export default Logout;