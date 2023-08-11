import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery} from '@apollo/react-hooks';
import React from 'react';


export const TOKEN_VALIDATION = gql`
query Query($refreshToken: String) {
  tokenValidation(refreshToken: $refreshToken)
}
`;


//app.js에서 라우팅 할 때 페이지별 권한(토큰)이 있는지 확인하는 함수.
const ProtectedRoute = ({ children }) => {
  console.log("ProtectedRoute 검사 시작");
  const cookies = new Cookies();
  const navigate = useNavigate();

  const refreshToken = cookies.get('refreshToken')

  const { loading, error, data, refetch } = useQuery(TOKEN_VALIDATION, {
    variables: { refreshToken: refreshToken }
  });
  refetch({ refreshToken: refreshToken });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //server에서 tokenValidaton에 성공하면
  if (!!data.tokenValidation) {
    console.log("tokenValidation 성공함");
    localStorage.setItem('token', data.tokenValidation);
  }
  //실패하면
  else {
    // refreshtoken이 유효하지 않음.
    console.log("tokenValidation 실패함.");
    localStorage.setItem('token', '');
    cookies.remove('refreshToken', { path: '/' });
    navigate('/login'); // 리다이렉트할 경로 설정
  }

  return children;

};

export default ProtectedRoute;