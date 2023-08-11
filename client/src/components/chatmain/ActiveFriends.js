// ActiveFriends.js

import React from 'react';
import {gql} from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import BadgeAvatars from '../../materials/AvatorWithBadge';
import { useEffect } from 'react';


export const ACTIVE_FRIENDS = gql`
query Query {
  getOnlineFriends
}
`;


const ActiveFriends = () => {
  
  const { loading, error, data, refetch } = useQuery(ACTIVE_FRIENDS);

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

  try{
  //이 부분을 map을 users -> user로 바꾸니 됐다. 뭐지..? 
  //users에서는 Cannot read properties of undefined (reading 'map')오류가 떴는데
  return (
    <div >
      <BadgeAvatars data={data}/>
    </div>
  );
}catch (error){
  return <p>Error :(</p>
}
} 

export default ActiveFriends;
