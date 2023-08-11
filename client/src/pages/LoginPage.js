import React from 'react';
import '../App.css'
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import theChatting from '../images/theChatting2_blue.png'

export const JWT_EXPIRE_TIME = 300000;


export const LOGIN_REQUEST = gql`
mutation LoginRequest($id: String!, $password: String!) {
  loginRequest(id: $id, password: $password){
    token
    refreshToken
  }
}
`;


export const REFRESHTOKEN_VALIDATION = gql`
query Query($refreshToken: String) {
  refreshTokenValidation(refreshToken: $refreshToken)
}
`;


const LoginPage = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  let input;
  //logIn은 뮤테이션 실행시키는 함수이다.

  const [logIn, { loading, error }] = useMutation(LOGIN_REQUEST);
  const { refetch } = useQuery(
    REFRESHTOKEN_VALIDATION, {
    variables: { refreshToken: cookies.get('refreshToken') },
  }
  );

  //settimeout 함수로 호출되는 함수.
  //refreshtoken만 유효하다면 새로 토큰을 발급해준다.
  const RefreshTimeout = async () => {
    console.log("RefreshTimeout가 실행되어 refreshtoken 확인 후 token 재발급 할 것임.");

    console.log("쿠키에서 가져온 refreshtoken은?" + cookies.get('refreshToken'));

    const { data } = await refetch({ refreshToken: cookies.get('refreshToken') });
    console.log("refreshToken이 실행됨. 결과는? : " + data.refreshTokenValidation);

    //refresh token을 살펴보는 요청을 보낸다. 그러면 서버에서 쿠키를 보고,
    //verify를 통해서 결정한다.
    //만약 아직 refresh token이 유효하다면 토큰을 새로 발급한다.
    //유효하지 않다면, 아무것도 반환하지 않는다.
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    //만약 access token이 만료됐거나(시간을 fe에서도 구해서 지나면 없애자.), 없으면
    if (data.refreshTokenValidation) {
      localStorage.setItem('token', data.refreshTokenValidation);
      //settimer 설정
      setTimeout(RefreshTimeout, JWT_EXPIRE_TIME - 290000);

      console.log("재발급 성공!");
    }
    else {
      //refreshtoken이 유효하지 않음.
      localStorage.setItem('token', '');
      cookies.remove('refreshToken', { path: '/' });
      navigate('/login'); // 리다이렉트할 경로 설정
      window.location.reload();
    }
  };


  const onSubmit = async (e) => {
    //e.preventDefault()를 호출하면 페이지가 새로고침되거나 
    //다른 동작이 실행되는 폼 제출의 기본 동작이 중지됩니다. 
    //이 경우에는 폼이 제출되었을 때 페이지가 새로고침되지 않고, 
    //onSubmit 함수의 내용만 실행됩니다.
    e.preventDefault();
    try {
      console.log("로그인요청 내용 : " + e.target.username.value + e.target.password.value);

      const { data } = await logIn({
        variables: {
          id: e.target.username.value,
          password: e.target.password.value
        }
      });

      if (data.loginRequest.token && data.loginRequest.refreshToken) {
        console.log("로그인 성공! : " + !!data.loginRequest.token + " "
          + data.loginRequest.refreshToken); // 뮤테이션 결과 출력

        //토큰 localstorage에 저장
        localStorage.setItem('token', data.loginRequest.token);
        console.log("---");
        console.log("---");

        //refreshtoken 쿠키에 저장
        cookies.set('refreshToken', data.loginRequest.refreshToken,
          {
            // httpOnly: true,
            // HTTPS로 쿠키를 전송하려면 몇 가지 요구 사항을 충족해야 합니다.

            // 1. SSL/TLS 인증서 설치: HTTPS를 사용하기 위해서는 SSL/TLS 인증서가 필요합니다. 이를 위해 인증서를 구매하거나 무료 인증 기관에서 발급받을 수 있습니다.

            // 2. 서버 설정: 웹 서버(예: Apache, Nginx)의 설정을 변경하여 HTTPS를 활성화해야 합니다. 이는 인증서를 설치하고 웹 서버 설정 파일을 수정하여 구성할 수 있습니다.

            // 3. 애플리케이션 설정: 애플리케이션에서도 HTTPS를 사용하도록 설정해야 합니다. 이는 프레임워크나 라이브러리에 따라 다를 수 있습니다. React의 경우, `react-scripts`를 사용하여 HTTPS로 개발 서버를 실행할 수 있습니다. `package.json` 파일에 `"start": "react-scripts start --https"`와 같이 스크립트를 추가하고, `npm start`를 실행하면 HTTPS로 개발 서버가 실행됩니다.

            // 위의 요구 사항을 충족하면 `secure: true`로 설정하여 쿠키를 HTTPS로 전송할 수 있습니다. 그러나 개발 환경에서는 자체 생성된 개발용 인증서를 사용하므로 웹 브라우저에서 보안 경고가 발생할 수 있습니다. 상용 환경에서는 신뢰할 수 있는 인증서를 사용하는 것이 좋습니다.
            // secure:false,
            // path:'/' ,
            // domain: 'http://localhost:3000'
          }
        );

        navigate('/');
      }
    } catch (error) {
      console.error(error); // 에러 처리
    }

    //input.value = ''는 폼 제출시 입력 필드의 값을 초기화하는 역할을 수행합니다.
    e.target.username.value = '';
    e.target.password.value = '';
  };

  console.log("-------------------------");
  //인증하는 부분은 백엔드에서. 백엔드에서 인증이 완료되면 메인 페이지를 넘겨준다.
  //그러면 프론트엔드 관점에서는, 데이터를 넘겨주고 url을 응답으로 넘겨주나?
  //spring은 어떻지?
  //아이디어 하나는 불리안으로 yes, no를 넘겨받아서 여기서 if하나로만 처리하는 것
  return (
    <div className='big-div' >
      {/* 로고 */}
      <Avatar
        src={theChatting}
        alt="My Image"
        sx={{
          width: "500px", height: "auto", margin: "auto", borderRadius: "0"
        }}
      />

      {/* 로그인폼 */}
      <div className="login-form">
        <Box component="form" onSubmit={onSubmit} noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            height: '60px'
          }}>

          {/* 아이디 */}
          <TextField
            variant="filled"
            margin="normal"
            id="username"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            InputProps={{ disableUnderline: true }}
            sx={{
              width: '300px',
              backgroundColor: '#e7e7e7',
              borderRadius: '10px',
              '& .MuiFilledInput-root': {
                borderRadius: '10px',
              },
              '& label.Mui-focused': {
                color: '#0C3773',
              },
            }}
          />
          {/* 패스워드 */}
          <TextField
            variant="filled"
            margin="normal"
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            InputProps={{ disableUnderline: true }}
            sx={{
              width: '300px',
              backgroundColor: '#e7e7e7',
              borderRadius: '10px',
              '& .MuiFilledInput-root': {
                borderRadius: '10px',
              },
              '& label.Mui-focused': {
                color: '#A0AAB4',
              },
            }}
          />
          {/* 로그인 버튼 */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: '20px', // 동그란 모서리를 위한 값
              backgroundColor: 'gray', // 회색 배경색
              width: '130px', // 버튼의 길이를 200px로 지정
              marginLeft: 'auto', // 가운데 정렬을 위해 오른쪽 여백을 자동으로 조정
              marginRight: 'auto', // 가운데 정렬을 위해 왼쪽 여백을 자동으로 조정
              '&:hover': {
                backgroundColor: '#0C346F',
              },
            }}
          >
            Sign In
          </Button>

        </Box>
      </div>

      {/* 회원가입페이지이동 */}
      <Grid container justifyContent="center" >
        <Grid item sx={{
          mt: '300px',
          color: 'gray',
        }}>
          <Link href="/signup" variant="body2" sx={{
            color: 'gray',
            textDecorationColor: 'gray',
            '&:hover': {
              color: '#0C346F',
              textDecorationColor: '#0C346F',
            },
          }}
          >
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </div>

  );
};

export default LoginPage;