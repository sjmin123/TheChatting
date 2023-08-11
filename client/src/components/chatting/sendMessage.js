import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/client';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, OutlinedInput } from '@mui/material';
import { useState } from 'react';


export const SEND_MESSAGE = gql`
mutation ($content: String!, $toUser: String!, $roomId: String!) {
  sendMessage(content: $content, toUser: $toUser, roomId: $roomId)
}
`;

const SendMessage = ({ refreshChatData, roomId, toUser, refreshPage }) => {

  console.log(roomId);

  const [message, setMessage] = useState('');

  const [send, { data, loading, error }] = useMutation(SEND_MESSAGE);
  let input;

  if (error) {
    return <div>Error:))</div>;
  }

  try {
    const onSubmit = async (e) => {
      e.preventDefault();
      await send({ variables: { content: message, toUser: toUser, roomId: roomId } });
      if (roomId == '') {
        console.log("방이 없어서 리로드!!");
        refreshPage();
      }
      setMessage('');
    };

    return (
      <div>
        <form onSubmit={onSubmit}>
          <OutlinedInput
            placeholder="메시지 입력"
            size="medium"
            autoFocus
            sx={{
              width: '450px',
              backgroundColor: '#e7e7e7',
              borderRadius: '30px',
              marginRight: '10px',
              border: 'none', // 외곽선 없애기
              '& .MuiFilledInput-root': {
                borderRadius: '10px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none', // 외곽선 없애기
              },
              '& label.Mui-focused': {
                color: '#A0AAB4',
              },
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            ref={node => { input = node; }}
          />
          <IconButton type="submit">
            <SendIcon sx={{ color: "#4e586e" }} />
          </IconButton>
        </form>
      </div>
    );
  } catch (error) {
    return <p>Error :(</p>
  }
}

export default SendMessage;