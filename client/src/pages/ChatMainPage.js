import React from 'react';
import { useReactiveVar } from "@apollo/client";
import ActiveFriends from '../components/chatmain/ActiveFriends.js';
import ChatList from '../components/chatmain/Chatlist.js';
import SearchFriend from '../components/chatmain/SearchFriend.js';
import SearchFriends from '../modules/SeachFriends.js';
import ButtonAppBar from '../materials/basicAppBar';
import { Box, Container } from '@mui/material';


function ChatMainPage() {

  const friends = useReactiveVar(SearchFriends);
  let activeFriends;
  let chatList;

  if (friends === "") {
    activeFriends = <ActiveFriends />;
    chatList = <ChatList />;
  }

  return (
    <Container sx={{
      display: 'flex',
      justifyContent: 'center', // 수평 가운데 정렬
      alignItems: 'center', // 수직 가운데 정렬
      minHeight: '100vh', // 화면 전체 높이만큼 Container를 채우도록 설정
    }}>
      <Box
        sx={{
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 auto',
          padding: '40px',
          borderRadius: '10px',
          minHeight: "500px",
          backgroundColor: '#fcfcfc',
          border: "1px solid gray",
          boxShadow: '0px 4px 10px rgba(81, 75, 58, 0.222)', // 그림자 추가
        }}>

        {/* 내용 */}
        <ButtonAppBar one="/setting" two="/friendlist" />
        <SearchFriend />
        {activeFriends}
        {chatList}

      </Box>
    </Container>
  );
}

export default ChatMainPage;
