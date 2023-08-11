// ChatList.js

import React from 'react';
import './getFriends.css';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import ButtonAppBar from '../../materials/basicAppBar';
import { Container } from '@mui/material';


export const GET_FRIENDS = gql`
query GetFriends {
  getFriends {
    roomIds
    users {
      nickname
      id
      email
    }
  }
}
`;


const GetFriends = () => {

  const { loading, error, data } = useQuery(GET_FRIENDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center', // 수평 가운데 정렬
        alignItems: 'center', // 수직 가운데 정렬
        minHeight: '100vh', // 화면 전체 높이만큼 Container를 채우도록 설정
      }}
    >
      <Box
        sx={{
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          padding: '40px',
          paddingTop: '6px',
          height: '612px',
          // backgroundColor: '#eefaf2',
          borderRadius: '10px',
          backgroundColor: '#fcfcfc',
          border: "1px solid gray",
          boxShadow: '0px 4px 10px rgba(81, 75, 58, 0.222)', // 그림자 추가
        }}
      >
        {/* appbar이다 */}
        <ButtonAppBar one="/setting" two="/addfriend" />
        <List sx={{
          width: '100%',
          width: 470,
          maxWidth: 470,
          marginTop: '30px',
          height: "450px",
          overflowY: 'auto', // 스크롤 적용
          scrollbarWidth: 'thin', // 스크롤바 스타일 조절
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '3px',
          },
        }}>
          {data && data.getFriends.users.map((user, index) => (

            <Link to={`/ChattingPage`} className="chat-item"
              state={{
                audience: user.id,
                name: user.nickname,
                roomId: data.getFriends.roomIds[index],
              }}>
              <ListItem alignItems="flex-start" sx={{ mt: -1, mb: -1, color: 'black', }}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={user.nickname}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="gray"
                      >
                        {user.email}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default GetFriends;