import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import SendMessage from '../components/chatting/sendMessage';
import IsMyFriend from '../components/chatting/isMyFriend';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import {Container} from '@mui/material';
import jwt_decode from "jwt-decode";
import { useRef,useEffect,useState } from 'react';

  
//일단 apollo client에서는 id와 audience만 보내고 server의 resolver에서
//이 두 변수를 뒤집어서도 쿼리로 db에 검색해서 내가 보내고 너가 받은거,
//너가 보내고 내가 받은거 다 받아서 시간순서대로 정렬해서 클라이언트에 보내주는
//로직을 짜자.

//채팅 데이터 가져오기
export const GET_CHAT_DATA = gql`
query GetChatData($roomId: String!, $audienceId: String!) {
getChatData(roomId: $roomId, audienceId: $audienceId) {
  roomId
  chats {
    createdAt
    content
    isRead
    from {
      id
      nickname
    }
  }
}}
`;


//채팅 읽기 요청 (db)
const READ = gql`
mutation Read($roomId: String!) {
  read(roomId: $roomId)
}
`;   


//메시지가 추가됐을 때를 위한 구독
const MESSAGE_ADDED = gql`
subscription MessageAdded($roomId: String!) {
  messageAdded(roomId: $roomId) {
    chat {
      content
      createdAt
      from {
        id
        nickname
      }
    }
    roomId
  }
}
`;


//메시지를 읽었을 때를 위한 구독
const MESSAGE_READ = gql`
subscription messageRead($roomId: String!) {
  messageRead(roomId: $roomId){
    bool
    roomId
  }
}
`; 
  

// 상대가 보내는 말풍선
const ReceivedBubble = ({ message, time }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px',marginRight: 'auto', }}>
      {/* 상대프로필 */}
      <Avatar src="/static/images/avatar/1.jpg" alt='name' sx={{ marginRight: '10px', backgroundColor:'#b9b9b9' }} />
      {/* 메시지내용 */}
      <Paper elevation={3} sx={{ padding: '10px',borderRadius:'20px', maxWidth: '300px', backgroundColor: '#4e586e' }}>
        <Typography sx={{marginLeft:"5px", marginRight:"5px", color:"white"}}>{message}</Typography>
      </Paper>
      {/* 시간표시 */}
      <Typography variant="caption" sx={{ color: 'gray', marginTop:'auto', marginLeft:'5px' }}>{time}</Typography>
    </Box>
  );
};


// 내가 보내는 말풍선
const SentBubble = ({ message ,time,isRead }) => {
  return (
    <div style={{ display:'flex', marginRight:'5px'}}>
    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px',marginLeft: 'auto' }}>
      {/* 글을 안읽었으면 1표시 */}
      <Typography variant="caption" sx={{ color: 'black', marginTop: 'auto', marginRight: '10px' }}>
        {isRead ? isRead : "1"}
      </Typography>
      {/* 시간표시 */}
      <Typography variant="caption" sx={{ color: 'gray', marginTop:'auto', marginRight:'5px' }}>{time}</Typography>
      {/* 메시지내용 */}
      <Paper
        elevation={3}
        sx={{ padding: '10px',
        borderRadius:'20px', maxWidth: '300px' }}
        >
        <Typography sx={{marginLeft:"5px", marginRight:"5px"}}>{message}</Typography>
      </Paper>
    </Box>

    </div>
  );
};


const ChattingPage = () => {
    //variable에 있는 데이터는 나, 너인데 나는 로그인시 케시나 세션으로 저장한거 불러와야 할거고
    //너는 전 컴포넌트에서 보내온 데이터를 이용한다.
    const location = useLocation();
    const audience = location.state.audience;
    const audienceName = location.state.name;
    let room = location.state.roomId;
    
    let roomId = '';

    //채팅 읽기 요청.
    const [read, { data: readData }] = useMutation(READ);
    
    const readChat=async()=>{
      console.log("readChat 실행됨!");
       const a= await read({ variables: { roomId:room }});
       console.log(a.data.read);
    }

    //처음에 읽기
    useEffect(() => {
      console.log("useEffect!!!!!!!!!!!!!!!!");
      readChat();
    }, []);
    
    //채팅데이터
    const [chatData, setChatData] = useState([]);
    
    //방이 없을때만 한 번 reload한다.
    const refreshPage=()=>{
      window.location.reload();
    }
    
      const realTimeOnChange = (newChatData) => {
        console.log("newChatData는???????"+newChatData.chat);
        console.log("중요!!!!!!!!!!!!!!!!!! :"+ newChatData.chat.from.id);
        console.log("중요!!!!!!!!!!!!!!!!!! :"+ jwt_decode(localStorage.getItem('token')).token);
        if(newChatData.chat.from.id!=jwt_decode(localStorage.getItem('token')).token){
          // 이건 내가 보낸게 아님! 그러므로 읽기 작업 수행
          // 1. db에서 읽기처리
          // 2. 읽기처리하면 연쇄적으로 구독한 화면을 새로 뿌려줌.
          readChat();
        }
        setChatData((prevChatData) => [...prevChatData, newChatData.chat]);

      };

    const { loading, error, data,refetch } = useQuery(GET_CHAT_DATA, {
      variables: { roomId: roomId, audienceId: audience },
    });
    refetch();
    
    //data가 생겼으면(채팅방이 존재하면) roomid를 할당한다.
    if(data){
      roomId=data.getChatData.roomId;
      room=data.getChatData.roomId;
    }

    //구독
    const {  data: data2 } = useSubscription(MESSAGE_ADDED, {
      variables: { roomId: room },
    });

    console.log("room은???????"+room);
    const {  data: data3 } = useSubscription(MESSAGE_READ, {
      variables: { roomId: room },
    });

    useEffect(() =>{
      if(data2){
        realTimeOnChange(data2.messageAdded);
    }
    },[data2])

    //채팅데이터 리스트에 대한 상태관리 로직
    //data에 변화가 있을 때마다(처음에도) chatData에다 data를 넣어준다.
    //한번뜸.
    useEffect(() => {
      if (data) {
        console.log("data는??????????????"+data);
        console.log('------------------------------------');
        console.log("useEffect감지됨!!");
        console.log('------------------------------------');
        setChatData(data.getChatData.chats);
      }
    }, [data]);
    
    //스크롤설정
    const messageEndRef = useRef(null); // useRef 초기화 타입 지정
    useEffect(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }, [chatData.length]);
    
    //동적으로 불러오는 쿼리
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error:)</div>;
    }

      // 상대방의 프로필과 이름
      const partner = {
        avatar: <Avatar />,
      };


    try{
      //채팅을 보내면 데이터 새로고침(refecth) 요청을 보낸다.
      const refreshChatData=async()=>{
        //mocking으로 했을 땐 오류가 뜸. 그게 모킹은 두번 같은 요청하면 오류가 뜨는 것 같음.
        console.log("called!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      }

    return (
      // {/* 화면영역시작 */}
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
        width:'500px',
        display: 'flex',
        flexDirection: 'column',
          alignItems: 'center',
          margin: '0 auto',
          padding:'40px',
          paddingTop:'20px',
          paddingBottom :'20px',
          borderRadius: '10px',
          height:"650px",
          backgroundColor: '#fcfcfc',
          border:"1px solid gray",
          boxShadow: '0px 4px 10px rgba(81, 75, 58, 0.222)', // 그림자 추가
        }}
      >

      {/* 상대 이름과프로필 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Avatar src={partner.avatar} alt={audienceName} sx={{ marginRight: '10px',backgroundColor: '#b9b9b9' }} />
        <Typography variant="h6">{audienceName}</Typography>
      </div>

      {/* 내 친구가 맞는지 확인 */}
      <IsMyFriend audienceId={audience}/>

      {/* 대화내용 */}
      <Box 
        autoFocus 
        sx={{
          height:"450px",
          width:"500px",
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
          {chatData.map((message, index) => (
            message.from.id === audience ? (
              <ReceivedBubble key={index} message={message.content}  time={new Date(Number(message.createdAt)).toLocaleString()} />
            ) : (
              <SentBubble key={index} message={message.content} 
              time={new Date(Number(message.createdAt)).toLocaleString()}
              isRead={message.isRead}
              />
            )
          ))}
        <div ref={messageEndRef}></div>
        </Box>

        {/* 메시지입력란, 전송버튼 */}
        <Box sx={{marginTop:'auto'}}>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center'}}>
              <SendMessage 
                roomId={roomId}
                toUser={audience}
                refreshPage={refreshPage}/>
          </div>
        </Box>

      </Box>
      </ Container>
  
    );
    }catch(error){
      return <p>Error :(</p>
    }
  }

  export default ChattingPage;