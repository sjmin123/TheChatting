import React from 'react';
import SearchFriends from '../../modules/SeachFriends';
import { useReactiveVar } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import AddFriend from './AddFriend';
import { Box, TextField, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import ButtonAppBar from '../../materials/basicAppBar';
import { Container } from '@mui/material';


export const GET_USERS = gql`
  query SearchUsers($nickname: String!) {
  searchUsers(nickname: $nickname) {
    id
    nickname
  }
}
`;


const SearchUser = () => {

  const nickname = useReactiveVar(SearchFriends);
  //usequery에서 한번 랜더링(랜더링이라고 부르는지는 모르겠지만 화면을 업데이트)한다.
  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    variables: { nickname: nickname }
  });

  try {
    //그리고 useReactiveVar에서도 업데이트되면 랜더링한다.
    //이렇게 2번 랜더링하는게 아닐까?
    //question : 왜 한번은 데이터가 없고 뒤에꺼는 있었을까
    const onChange = (e) => {
      SearchFriends(e.target.value);
      refetch({ nickname: e.target.value });
    };

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
            // justifyContent: 'center',
            // justifyContent: 'center',
            margin: '0 auto',
            padding: '40px',
            // backgroundColor: '#eefaf2',
            borderRadius: '10px',
            minHeight: "500px",
            backgroundColor: '#fcfcfc',
            border: "1px solid gray",
            boxShadow: '0px 4px 10px rgba(81, 75, 58, 0.222)', // 그림자 추가
            // height:'60px'
          }}>

          <ButtonAppBar one='/setting' two='/' />

          {/* 검색부분 */}
          <TextField fullWidth label="유저 검색" id="fullWidth" onChange={onChange}
            variant="filled"
            margin="normal"
            autoFocus
            InputLabelProps={{
              style: {
                color: '#f1f1f1', // 기본 글씨 색상을 하얀색으로 설정
              },
            }}
            InputProps={{ disableUnderline: true }}
            sx={{
              width: '450px',
              // marginLeft:'25px',

              backgroundColor: 'rgba(78, 88, 110, 0.7)',
              borderRadius: '10px',
              '& .MuiFilledInput-root': {
                borderRadius: '10px',
                color: '#f1f1f1', // 텍스트 색상을 하얀색으로 설정
              },
              '& label.Mui-focused': {
                color: '#A0AAB4',
              },
            }}
          />


          <Box sx={{
            width: '100%',
            width: 470,
            maxWidth: 470,
            backgroundColor: '#fcfcfc',
            scrollMarginTop: '40px',
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
            {data && data.searchUsers && data.searchUsers.map((user, index) => (


              <ListItem alignItems="flex-start" sx={{ mt: -1.5, mb: -2, padding: 'auto' }}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ backgroundColor: '#b9b9b9' }} />
                </ListItemAvatar>

                <ListItemText sx={{ marginTop: "14px" }}
                  primary={user.nickname}
                />
                <AddFriend userId={user.id} />

              </ListItem>


            ))}
          </Box>

        </Box>
      </Container>
    );
  } catch (error) {
    console.log(error);
    return <p>Error :(</p>
  }
};

export default SearchUser;