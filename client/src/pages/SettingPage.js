import React, { useState } from 'react';
import Logout from '../components/common/Logout';
import { Container } from '@mui/material';

const SettingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center', // 수평 가운데 정렬
        alignItems: 'center', // 수직 가운데 정렬
        minHeight: '100vh', // 화면 전체 높이만큼 Container를 채우도록 설정
      }}
    >
      <div className={`settings-page ${isDarkMode ? 'dark-mode' : ''}`}>
        <Logout />
      </div>
    </Container>
  );
};

export default SettingPage;
