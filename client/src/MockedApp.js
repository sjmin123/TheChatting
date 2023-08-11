import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

//page
import ChatMainPage from './pages/ChatMainPage.js';
import SettingsPage from './pages/SettingPage.js';
import LoginPage from './pages/LoginPage.js';
import ChattingPage from './pages/ChattingPage.js';
import SignupPage from './pages/SignupPage.js';
import FriendsListPage from './pages/FriendsListPage.js';
import AddFriendPage from './pages/AddFriendPage.js';

//mocking하는 gql imports.
import { ACTIVE_FRIENDS } from './components/chatmain/ActiveFriends.js';
import { CHAT_LIST } from './components/chatmain/Chatlist.js';
import { LOGIN_REQUEST } from './pages/LoginPage.js';
import { SIGNUP_MUTATION } from './pages/SignupPage.js';
import { SEARCH_FRIENDS } from './components/chatmain/SearchFriend.js';
import { SEND_MESSAGE } from './components/chatting/sendMessage.js';
import { GET_CHAT_DATA } from './pages/ChattingPage.js';
import { GET_FRIENDS } from './components/newChat/GetFriends.js';
import { GET_USERS } from './components/addfriend/SearchUser.js';
import { ADD_FRIEND } from './components/addfriend/AddFriend.js';


const mocks = [
  {
    request: {
      query: ACTIVE_FRIENDS,
    },
    result: {
      "data": {
        "getOnlineFriends": [
          "jun",
          "james"
        ]
      }
    },
  },
  {
    request: {
      query: CHAT_LIST
    },
    result: {
      "data": {
        "getChatList": {
          "name": [
            "jun",
            "james"
          ],
          "id": [
            "647f50f8e0b9c6ce5be32a08",
            "647f512ce0b9c6ce5be32a0a"
          ],
          "roomId": [
            "64816f8c6be767f6dcb7a2b8",
            "64846d8e99b633617cb0c6c5"
          ],
          "chatList": [
            {
              "createdAt": "1686204300737",
              "content": "hello there!"
            },
            {
              "createdAt": "1686400398704",
              "content": "hi james!!"
            }
          ]
        }
      }
    },
  },
  {
    request: {
      query: LOGIN_REQUEST,
      variables: {
        id: 'a',
        password: 'a',
      },
    },
    result: {
      "data": {
        "loginRequest": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjY0N2YwN2ViZTBiOWM2Y2U1YmUzMmEwNiIsImlhdCI6MTY4NzI0NDM1OSwiZXhwIjoxNjg3MjgwMzU5fQ.aauMppbI_thBIh-BPFbhSwo_HLvqS3X-fcstw2udZYY"
      }
    },
  },
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        email: 'user@naver.com',
        password: 'user',
        nickname: 'user'
      },
    },
    result: {
      "data": {
        "signUp": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTE2MGE3ODE3ZmZmZjBjOTFkOWUxYiIsImlhdCI6MTY4NzI0OTA2MywiZXhwIjoxNjg3Mjg1MDYzfQ.tvrfOSg_fXwkaGxgVOIL0v-iClzOxe6DwCkmIsdpJMM"
      }
    },
  },
  {
    request: {
      query: SEARCH_FRIENDS,
      variables: {
        nickname: 'j'
      }
    },
    result: {
      "data": {
        "searchFriends": {
          "roomIds": [
            "64816f8c6be767f6dcb7a2b8",
            "64846d8e99b633617cb0c6c5"
          ],
          "users": [
            {
              "id": "647f50f8e0b9c6ce5be32a08",
              "nickname": "jun",
              "email": "junjun@naver.com"
            },
            {
              "id": "647f512ce0b9c6ce5be32a0a",
              "nickname": "james",
              "email": "james@naver.com"
            }
          ]
        }
      }
    },
  },
  {
    request: {
      query:
        SEND_MESSAGE,
      variables: {
        content: 'hello!',
        toUser: '647f50f8e0b9c6ce5be32a08',
        roomId: '64816f8c6be767f6dcb7a2b8'
      },
    },
    result: {
      "data": {
        "sendMessage": true
      }
    },
  },
  {
    request: {
      query:
        GET_CHAT_DATA,
      variables: {
        roomId: '64816f8c6be767f6dcb7a2b8',
        audienceId: '647f50f8e0b9c6ce5be32a08'
      },
    },
    result: {
      "data": {
        "getChatData": [
          {
            "createdAt": "1686204300737",
            "content": "hello there!",
            "from": {
              "id": "647f07ebe0b9c6ce5be32a06",
              "nickname": "john"
            }
          },
          {
            "createdAt": "1686326795936",
            "content": "oh hi!",
            "from": {
              "id": "647f07ebe0b9c6ce5be32a06",
              "nickname": "john"
            }
          }
        ]
      }
    },
  },
  {
    request: {
      query: GET_FRIENDS,
    },
    result: {
      "data": {
        "getFriends": {
          "roomIds": [
            "64816f8c6be767f6dcb7a2b8",
            "64846d8e99b633617cb0c6c5"
          ],
          "users": [
            {
              "nickname": "jun",
              "id": "647f50f8e0b9c6ce5be32a08",
              "email": "junjun@naver.com"
            },
            {
              "nickname": "james",
              "id": "647f512ce0b9c6ce5be32a0a",
              "email": "james@naver.com"
            }
          ]
        }
      }
    },
  },
  {
    request: {
      query:
        ADD_FRIEND,
      variables: {
        id: '647f50f8e0b9c6ce5be32a08',
      },
    },
    result: {
      "data": {
        "addFriend": true
      }
    },
  },

  {
    request: {
      query:
        GET_USERS,
      variables: {
        nickname: 'j'
      },
    },
    result: {
      "data": {
        "searchUsers": [
          {
            "id": "647f07ebe0b9c6ce5be32a06",
            "nickname": "john"
          },
          {
            "id": "647f50f8e0b9c6ce5be32a08",
            "nickname": "jun"
          },
          {
            "id": "647f512ce0b9c6ce5be32a0a",
            "nickname": "james"
          },
          {
            "id": "64817277e5d1f6bf79ead715",
            "nickname": "jackson1"
          }
        ]
      }
    },
  },

  // {
  //   request:{
  //     query: 

  //   },
  //   result:{

  //   },
  // },
];

function MockedApp() {

  const client = new ApolloClient({
    cache: new InMemoryCache(),
  });

  return (

    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false} client={client}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<ChatMainPage />} />
          <Route path="/setting" element={<SettingsPage />} />
          <Route path="/ChattingPage" element={<ChattingPage />} />
          <Route path="/friendlist" element={<FriendsListPage />} />
          <Route path="/addfriend" element={<AddFriendPage />} />
        </Routes>
      </MockedProvider>
    </BrowserRouter>

  );

};

export default MockedApp;