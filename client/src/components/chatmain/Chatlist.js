// ChatList.js

import React from 'react';
import {gql} from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import AlignItemsList from '../../materials/AlignItemsList';
import { useEffect } from 'react';


export const CHAT_LIST = gql`
query GetChatList {
  getChatList {
    name
    id
    roomId
    notReadChat
    chatList {
      createdAt
      content
    }
  }
}
`;


const ChatList = () => {
  
  const { loading, error, data, refetch } = useQuery(CHAT_LIST);

    // 1.5초마다 데이터를 갱신하도록 설정
    useEffect(() => {
      const intervalId = setInterval(() => {
        refetch();
      }, 1500);
      // 컴포넌트가 언마운트될 때 interval 정리
      return () => clearInterval(intervalId);
    }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const sortedChatList=data.getChatList.slice().sort(function(a, b) {
    return b.chatList.createdAt - a.chatList.createdAt;
  });
  
  const dateList=[];
  sortedChatList.map((one, index) => {
    // console.log("chat은 : "+chat.chatList.createdAt);
    const date = new Date(Number(one.chatList.createdAt)); // timestamp를 밀리초 단위로 변환하여 Date 객체 생성
    const formattedDate = date.toLocaleString(); // 로컬 타임존에 따라 날짜와 시간을 기본 형식으로 변환
    // one.chatList.createdAt=formattedDate;
    dateList.push(formattedDate);
  }
  )

  
  try{

  return (
    <div >
      <AlignItemsList list={sortedChatList} dateList={dateList}/>
    </div>
  );
}catch (error){
  return <p>Error :(</p>
}
};

export default ChatList;