import React from 'react';
// import './searchcfriend.css'; // 컴포넌트 스타일 파일
import SearchFriends from '../../modules/SeachFriends';
import { useReactiveVar } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';


export const SEARCH_FRIENDS = gql`
    query SearchFriends($nickname: String!) {
      searchFriends(nickname: $nickname) {
        roomIds
        users {
          id
          nickname
          email
        }
      }
    }
  `;

const SearchFriend = () => {

  const nickname = useReactiveVar(SearchFriends);
  //usequery에서 한번 랜더링(랜더링이라고 부르는지는 모르겠지만 화면을 업데이트)한다.
  const { loading, error, data, refetch } = useQuery(SEARCH_FRIENDS, {
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
    console.log(data);

    return (
      <div>

        {/* 검색부분 */}
        <Box sx={{ width: 500, maxWidth: '100%', }}>
          <TextField fullWidth label="검색" id="fullWidth" onChange={onChange}
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
              marginLeft: '25px',
              // backgroundColor: '#4e586e',
              backgroundColor: 'rgba(78, 88, 110, 0.7)',
              borderRadius: '10px',

              '& .MuiFilledInput-root': {
                borderRadius: '10px',
                color: '#f1f1f1', // 텍스트 색상을 하얀색으로 설정
              },
              '& label.Mui-focused': {
                color: '#111111',
              },
            }}
          />
        </Box>

        {/* 검색결과부분 */}
        <Box sx={{
          width: '100%',
          width: 470,
          maxWidth: 470,
          bgcolor: '#fcfcfc',
          scrollMarginTop: '40px',
          height: "auto",
          overflowY: 'auto', // 스크롤 적용
          scrollbarWidth: 'thin', // 스크롤바 스타일 조절
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '3px',
          },
        }}
        >
          {data && data.searchFriends && data.searchFriends.users.map((one, index) => (

            <Link to={`/ChattingPage`} key={index} className="chat-item"
              state={{
                audience: one.id,
                name: one.name,
                roomId: data.searchFriends.roomIds[index],
              }}>

              <ListItem alignItems="flex-start" sx={{ mt: -0.5, mb: -1, padding: 'auto', color: 'black', }}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>

                <ListItemText
                  primary={one.nickname}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline', }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {one.email}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </Link>

          ))}
        </Box>

      </div>

    );
  } catch (error) {
    return <p>Error :(</p>
  }
};

export default SearchFriend;