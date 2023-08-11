import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache,HttpLink,ApolloLink } from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities';
// import './App.css'

//page
// import ChatMain from './pages/ChatMainPage.js';
// import ChattingPage from './pages/ChattingPage.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';


import ChatMainPage from './pages/ChatMainPage.js';
import SettingsPage from './pages/SettingPage.js';
import LoginPage from './pages/LoginPage.js';
import ChattingPage from './pages/ChattingPage.js';
import SignupPage from './pages/SignupPage.js';
import FriendsListPage from './pages/FriendsListPage.js';
import AddFriendPage from './pages/AddFriendPage.js';

import ProtectedRoute from './ProtectedRoute.js';

import { Box } from '@mui/material';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import WebSocket from 'ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  typography: {
    fontFamily: 'Gothic A1, sans-serif',
    // fontfamily: 'Gothic A1 sans-serif',
  },
});


//서버링크설정
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });


// const wsLink = new WebSocketLink({
//   uri: 'ws://localhost:8080', // WebSocket 서버의 주소를 여기에 입력합니다.
//   options: {
//     reconnect: true, // 연결이 끊어졌을 때 자동으로 재연결을 시도할지 여부를 설정합니다.
//     // 웹소켓 프로토콜 버전을 지정합니다.
//     webSocketVersion: 13,
//   },
// });

//원래꺼
//웹소켓링크설정
// const wsLink = new WebSocketLink(
//   new SubscriptionClient("ws://localhost:8080/graphql", {
//     reconnect: true
//   })
// );

//공식문서꺼
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8080/graphql',
}));

// 커스텀 링크 생성
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  console.log("헤더에 보낼 token이 존재하는지 여부: "+!!token);
  
  // 헤더에 토큰을 추가
  operation.setContext(({ headers }) => ({
    
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }));
  return forward(operation);
});


export const client = new ApolloClient({
  link: ApolloLink.split(
    // Operation 타입에 따라 HTTP 또는 WebSocket 링크를 선택하여 사용합니다.
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink)
    ),
  cache: new InMemoryCache(),
  });



const App = () => {
  return (

    <ThemeProvider theme={theme}>
    <Router>
      <ApolloProvider client={client}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={
          <ProtectedRoute><ChatMainPage /></ProtectedRoute>
        }/>
        <Route path="/setting" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        }/>
        <Route path="/ChattingPage" element={
          <ProtectedRoute><ChattingPage /></ProtectedRoute>
        }/>
        <Route path="/friendlist" element={
          <ProtectedRoute><FriendsListPage /></ProtectedRoute>
        }/>
        <Route path="/addfriend" element={
          <ProtectedRoute><AddFriendPage /></ProtectedRoute>
        }/>
      </Routes>
      </ApolloProvider>
    </Router>
    </ThemeProvider>
  );
};


export default App;