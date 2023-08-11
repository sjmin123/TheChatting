import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { MenuItem } from '@mui/material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';


export const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!, $nickname: String!) {
  signUp(email: $email, password: $password, nickname: $nickname)
}
`;


const SignupPage = () => {
  const [signupMutation, { loading, error }] = useMutation(SIGNUP_MUTATION);
  const [username, setUsername] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [emailSuffix, setEmailSuffix] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const currencies = [
    {
      value: 'naver.com',
      label: 'naver.com',
    },
    {
      value: 'gmail.com',
      label: 'gmail.com',
    },
    {
      value: 'daum.net',
      label: 'daum.net',
    },
    {
      value: 'hanmail.com',
      label: 'hanmail.com',
    },
    {
      value: 'nate.com',
      label: 'nate.com',
    },
  ];


  try {
    const navigate = useNavigate();


    const handleUsernameChange = (e) => {
      setUsername(e.target.value);
    };

    const handleSiteChange = (e) => {
      setSelectedSite(e.target.value);
    };

    const handleEmailSuffixChange = (e) => {
      setEmailSuffix(e.target.value);
    };

    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
      setPasswordMismatch(e.target.value !== password);
    };

    const handleNicknameChange = (e) => {
      setNickname(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (password !== confirmPassword) {
        setPasswordMismatch(true);
        return;
      }

      const email = `${username}@${emailSuffix}`;

      signupMutation({
        variables: {
          email,
          password,
          nickname,
        },
      }).then((data) => {
        // 회원가입 성공 처리
        console.log('회원가입 성공!', data);
        navigate('/')
      }).catch((error) => {
        // 회원가입 실패 처리
        console.error('회원가입 실패:', error);
      });
    };


    return (
      <Container maxWidth="xl">
        {/* <h1>회원가입</h1> */}
        <Box component="form" onSubmit={handleSubmit} noValidate
          sx={{
            width: '450px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            marginTop: '100px',
            padding: '40px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: "1px solid gray",
            boxShadow: '0px 4px 10px rgba(81, 75, 58, 0.222)', // 그림자 추가
          }}>

          <Typography variant="h4" >
            Sign In
          </Typography>
          <br /><br />
          <label>
            <Grid container marginBottom={'10px'}>

              {/* 첫 번째 요소 */}
              <Grid item xs={5}>
                <TextField
                  variant="filled"
                  id="username"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    width: '180px',
                    backgroundColor: '#e7e7e7',
                    borderRadius: '10px',
                    '& .MuiFilledInput-root': {
                      borderRadius: '10px',
                    },
                    '& label.Mui-focused': {
                      color: '#A0AAB4',
                    },
                  }}
                  value={username} // value 설정
                  onChange={handleUsernameChange} // onChange 이벤트 핸들러 설정
                />
              </Grid>

              {/* 두 번째 요소 */}
              {/* 이메일: */}
              <Grid item xs={2} sx={{ display: 'flex' }}>
                <AlternateEmailIcon sx={{ margin: 'auto', marginLeft: '27px' }} />
              </Grid>

              {/* 세 번째 요소 */}
              <Grid item xs={5}>
                <TextField
                  id="filled-select-currency"
                  select
                  label="Select"
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    width: '180px',
                    backgroundColor: '#e7e7e7',
                    borderRadius: '10px',
                    '& .MuiFilledInput-root': {
                      borderRadius: '10px',
                    },
                    '& label.Mui-focused': {
                      color: '#A0AAB4',
                    },
                  }}
                  value={emailSuffix}
                  onChange={handleEmailSuffixChange}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

            </Grid>
          </label>

          <label>
            {/* 비밀번호: */}
            <TextField
              variant="filled"
              margin="normal"
              type="password"
              id="password"
              label="Password"
              name="password"
              autoComplete="password"
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
              value={password}
              onChange={handlePasswordChange}
            />
          </label>

          <label>
            {/* 비밀번호 확인: */}
            <TextField
              variant="filled"
              margin="normal"
              type="password"

              label="Enter password again"
              name="password"
              autoComplete="password"
              InputProps={{ disableUnderline: true }}
              error={password !== confirmPassword}
              helperText={password !== confirmPassword ? "Incorrect entry." : ""}
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
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </label>

          <label>
            {/* 닉네임: */}
            <TextField
              variant="filled"
              margin="normal"
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
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
              value={nickname}
              onChange={handleNicknameChange}
            />
          </label>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading} // 로딩 중인 경우 버튼 비활성화
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
          {error && <p>회원가입에 실패했습니다.</p>}
        </Box>
      </Container>
    );
  } catch (error) {
    return <p>Error :(</p>
  }
};

export default SignupPage;