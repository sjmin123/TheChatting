import { ApolloServer } from '@apollo/server';
import jwt from 'jsonwebtoken';
import { gql } from 'apollo-server';
import { ApolloError } from 'apollo-server';
import express from 'express'
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './database/db.js'
import resolvers from './resolver.js'
import { USER_KEY } from './resolver.js';
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';


const typeDefs = gql`

  type User {
    id: ID!
    email: String!
    password: String!
    nickname: String!
    friends: [User!]
    rooms: [Room]
    isActive: Boolean!
  }

  type Room {
    id: ID!
    chats: [Chat]
    audiences: [String!]
  }
  
  type Chat {
    id: ID!
    content: String!
    createdAt: String!
    from: User!
    to: User!
    isRead: Boolean!
  }

  type chatListtype{
    chatList: Chat!
    name: String!
    id: String!
    roomId: String!
    notReadChat: Int! 
  }

  type userAndRoomId{
    users: [User!]
    roomIds: [String]
  }

  type ChatAndRoomId{
    roomId: String!
    chats: [Chat!]
  }

  type TokenAndRefreshToken{
    token: String!
    refreshToken: String!
  }

  type OneChatAndRoomId{
    roomId: String!
    chat: Chat!
  }

  type BooleanAndRoomId{
    roomId: String!
    bool: Boolean!
  }

  type Query {
    getUser(id: ID!): User
    users: [User]
    getChatData(roomId:String!, audienceId:String!):ChatAndRoomId
    getOnlineFriends: [String!]
    getChatList: [chatListtype]
    searchFriends(nickname:String!):userAndRoomId
    getFriends: userAndRoomId
    searchUsers(nickname:String!): [User!]
    refreshTokenValidation(refreshToken:String):String!
    tokenValidation(refreshToken:String):String!
    isMyFriend(audienceId:String):Boolean!
  }

  type Mutation {
    addUser(email: String!,
      password: String!,
      nickname: String!): User!
    sendMessage(roomId:String, content:String!, toUser:String!):Boolean!
    loginRequest(id:String!, password:String!):TokenAndRefreshToken!
    signUp(email:String!, password:String!, nickname:String!):String!
    addFriend(id:String!):Boolean
    logout:Boolean!
    read(roomId:String!): Boolean!
  }
  type Subscription {
    messageAdded(roomId:String!): OneChatAndRoomId!
    messageRead(roomId:String!): BooleanAndRoomId!
   }
`;


// 전역 예외 처리 콜백 함수
const handleUncaughtException = (error) => {
  console.error('Uncaught Exception:', error);
  // 원하는 동작 수행
  // 예: 로깅, 에러 보고 등
  throw new ApolloError('globally error occured');
};


// 전역 예외 처리 등록
process.on('uncaughtException', handleUncaughtException);


//토큰이 맞는지 실제로 검증해주는 부분.
//근데 토큰이 없거나 올바르지 안하고 해서 여기서 차단하진 않음.
//그냥 토큰이 없는 상태로 resolver로 넘어가는 것임.
const getUser = token => {
  try {
    console.log("헤더로 넘어온 토큰 검증 시작!");
    //토큰이 있으면
    if (token) {
      //확인작업. 맞는 토큰인지.
      console.log("- 토큰은 있음!");
      if (jwt.verify(token, USER_KEY)) {
        console.log("헤더로 넘어온 토큰 검증 성공!");
        return token
      }
      else {
        console.log("- 토큰은 있으나 verify실패");
      }
    }
    //없으면
    console.log("- 토큰 없음");
    return null;
  } catch (error) {
    console.log("error 발생");
    return null
  }
}


const schema = makeExecutableSchema({ typeDefs, resolvers });

//-----------------------------------------------------------------------------

//apollo 공식문서 따라하기(express 사용)
const app = express();
const httpServer = createServer(app);


//공식문서꺼
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql',
});

// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const webSoketServer = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});


await webSoketServer.start();
app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(webSoketServer));


// 웹소켓 서버의 포트번호를 8080으로 변경
const port = 8080;
httpServer.listen(port, () => {
  console.log(`HTTP server listening on port ${port}`);
});


const serverApp = express();
const serverHttpServer = createServer(serverApp);


const server = new ApolloServer({
  schema: schema,
  // cors: true, // CORS 허용 설정
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  debug: false,
});


await server.start();


serverApp.use(cors());
serverApp.use(bodyParser.json());
serverApp.use(expressMiddleware(server, {
  context: ({ req }) => {
    //req의 Authorization 헤더에서 토큰을 추출.
    const token = req.get('Authorization') || '';
    const tokendLast = getUser(token.replace('Bearer ', ''));
    //bearer문자를 없애고 getUser를 적용.
    //여기서는 오류를 던지지 않는다.(그러면 모든 요청들이 인가를 해야 하므로)
    //token이 인증되지 않으면 안된 상태로 리턴하고 접근 못하도록 막는 건 각 reslover에서
    console.log("context 저장 여부 : " + !!tokendLast);
    return { token: tokendLast };
  },
}));

//서버 실행
const serverPort = 4000;


serverHttpServer.listen(serverPort, () => {
  console.log(`🚀 Server ready at ${serverPort}`);
});


connectDB();


