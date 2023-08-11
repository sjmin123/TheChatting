import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_FRIEND } from '../addfriend/AddFriend';
import { Typography, Button, Box } from '@mui/material';

export const IS_MY_FRIEND = gql`
query Query($audienceId: String) {
  isMyFriend(audienceId: $audienceId)
}
`;

const IsMyFriend = (audienceId) => {

  console.log("IsMyFriend 실행");
  console.log(audienceId.audienceId)

  //내 친구가 맞는지 확인
  const { loading, error, data } = useQuery(IS_MY_FRIEND, {
    variables: { audienceId: audienceId.audienceId },
  });

  const [add] = useMutation(ADD_FRIEND);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error:)</div>;
  }

  console.log("IS_MY_FRIEND의 결과는?" + data.isMyFriend);

  //친구 추가

  try {
    //추가하기 버튼을 누르면 친구 추가 mutation을 실행하고 reload한다.
    const addFriend = async (e) => {
      const { data, loading, error } = await add({ variables: { id: audienceId.audienceId } });
      if (loading) {
        return <div>Loading...</div>;
      }
      if (error) {
        return <div>Error:))</div>;
      }
      window.location.reload();
    };

    //만약 친구가 아니면 이 창을 띄우고
    if (!data.isMyFriend) {
      return (
        <Box sx={{ backgroundColor: '#e7e7e7', padding: '5px', margin: "10px", marginBottom: "20px", borderRadius: "20px" }}>
          <Typography variant="body1" sx={{ marginLeft: "8px" }}>
            당신의 친구가 아닙니다. 친구로 추가하시겠습니까?
            <Button variant="contained" onClick={addFriend}
              sx={{
                height: "35px", marginLeft: "5px", borderRadius: "20px", backgroundColor: "#4e586e", '&:hover': {
                  backgroundColor: "#3a4050",
                },
              }}
            >
              추가
            </Button>
          </Typography>
        </Box>
      )
    }
    //친구이면 그냥 리턴한다.
    else return undefined;

  } catch (error) {
    return <p>Error :(</p>
  }
}

export default IsMyFriend;