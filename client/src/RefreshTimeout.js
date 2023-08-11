// import { gql } from 'apollo-boost';
// import { useQuery } from '@apollo/client';
// import React from 'react';
// import Cookies from 'universal-cookie';
// import { JWT_EXPIRE_TIME } from "./pages/LoginPage";


// export const REFRESHTOKEN_VALIDATION = gql`
// query Query($refreshToken: String) {
//   refreshTokenValidation(refreshToken: $refreshToken)
// }
// `;


// //settimeout 함수로 호출되는 함수.
// //refreshtoken만 유효하다면 새로 토큰을 발급해준다.
// const RefreshTimeout = () => {
//   console.log("RefreshTimeout가 실행되어 refreshtoken 확인 후 token 재발급");

//   const cookies = new Cookies();

//   //refresh token을 살펴보는 요청을 보낸다. 그러면 서버에서 쿠키를 보고,
//   //verify를 통해서 결정한다.
//   //만약 아직 refresh token이 유효하다면 토큰을 새로 발급한다.
//   //유효하지 않다면, 아무것도 반환하지 않는다.
//   const { loading, error, data } = useQuery(REFRESHTOKEN_VALIDATION, {
//     variables: { refreshToken: cookies.get('refreshToken') }
//   });
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

//   //만약 access token이 만료됐거나(시간을 fe에서도 구해서 지나면 없애자.), 없으면
//   if (data.refreshTokenValidation) {
//     console.log("재발급 성공!");

//     localStorage.setItem('token', data.refreshTokenValidation);
//     //settimer 설정
//     setTimeout(RefreshTimeout, JWT_EXPIRE_TIME - 30000);
//   }
//   else {
//     //refreshtoken이 유효하지 않음.
//     localStorage.setItem('token', '');
//     cookies.remove('refreshToken', { path: '/' });
//     navigate('/login'); // 리다이렉트할 경로 설정
//     window.location.reload();
//   }
// };

// export default RefreshTimeout;