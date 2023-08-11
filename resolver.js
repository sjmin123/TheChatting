import User from './database/models/user.js';
import Chat from './database/models/chat.js';
import Room from './database/models/room.js';
import MakeRegexByCho from './module/MakeRegexByCho.js';
import tokenValidation from './module/tokenvalidation.js';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import validator from 'validator';
import { ApolloError } from 'apollo-server';
import { PubSub, withFilter } from 'graphql-subscriptions';

import { startSession } from 'mongoose';

const currentUser = '647f07ebe0b9c6ce5be32a06';

export const USER_KEY = "user_key";
export const USER_REFRESH_KEY = "refresh_key";

const pubsub = new PubSub();

const resolvers = {

  Query: {

    //개발용
    getUser: async (_, { id }, { token }) => {
      try {
        console.log("getUser 요청됨")
        tokenValidation(token);

        const user = await User.findById(id).exec();

        return user;
      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('Failed to fetch user');
      }
    },

    //개발용
    users: async (_, args) => {
      try {
        console.log("users 요청됨");

        const user = await User.find();
        return user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    //audience와의 채팅 내역 모두 불러오기
    //chat 하나하나가 누가 보냈는지는 프론트엔드에서 관리
    getChatData: async (_, { roomId, audienceId }, { token }) => {
      try {
        console.log("getChatData 요청됨");

        tokenValidation(token);

        let theRoomId = ''
        let chatList;

        //일단 내 rooms를 가져온다.
        const myRoomsList = await User.findById(jwt.decode(token).token).populate('rooms').select('-_id rooms')
        // console.log("rooms는"+myRoomsList.rooms);

        //각각의 room을 살펴보면서
        for (const index in myRoomsList.rooms) {
          // console.log("myRoomsList.rooms[index]는 :" + myRoomsList.rooms[index]);

          //만약 나와 상대의 id로 구성된 room이 있다면 
          if (myRoomsList.rooms[index].audiences.includes(jwt.decode(token).token) &&
            myRoomsList.rooms[index].audiences.includes(audienceId)) {

            //그 room의 id를 theRoomId에 저장하고
            theRoomId = myRoomsList.rooms[index]._id;
            // console.log("room 찾음!! : "+theRoomId);

            //해당하는 chat를 불러다가
            chatList = await Room.findById(theRoomId)
              .populate({
                path: 'chats',
                populate: { path: 'from', select: '_id nickname' }
              })
              .select('chats');

            // console.log("최종 반환 [chat]은? : "+chatList.chats);
            //반환한다.
            return {
              chats: chatList.chats,
              roomId: chatList._id
            };
          }
        }
        console.log("room 못찾음 ㅜㅜ");
        //room 객체를 찾고
        return {
          chats: [],
          roomId: ''
        };

        //그리고 채팅내역을 반환한다.
        return chats;
      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('error occured while getting chat data');
      }
    },

    //친구중에서 온라인상태인 친구의 이믈과 프로필 불러오기.
    //프로필은 다른 db에서 관리 예정
    getOnlineFriends: async (_, args, { token }) => {
      try {
        console.log("getOnlineFriends 요청됨");

        tokenValidation(token);

        const activeFriends = await User.find()
          .where('_id').equals(jwt.decode(token).token)
          .populate({ path: 'friends' })
          .select('-_id friends');

        // friends 배열에서 isActive가 true인 데이터만 필터링
        const nicknames = activeFriends[0].friends
          .filter(friend => friend.isActive === true)
          .map(friend => friend.nickname);

        return nicknames;
      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('error occured while getting online friends');
      }
    },

    //room에서 가장 최근 대화 내용, 날짜 상대 이름 배열로 가져오기.
    //room들에 각자 
    getChatList: async (_, args, { token }) => {
      try {
        console.log("getChatList 요청됨");

        tokenValidation(token);

        //먼저 내 id의 room들을 불러온다.
        const room = await User.findOne()
          .where('_id').equals(jwt.decode(token).token)
          .select('-_id rooms');


        const chatList = [];
        const nameList = [];
        const idList = [];
        const roomIdList = [];
        const notReadChatList = [];

        // await Promise.all(
        //room의 chat들을 불러오고 그중에서 가장 최근껄 뽑는다.
        //그리고 chatList에 하나씩 넣는다.(map을 통해서 room들마다 수행한다.)
        // room.rooms.map(async (eachRoom) => {
        for (const eachRoom of room.rooms) {
          //room의 id를 저장하는 리스트.
          roomIdList.push(eachRoom);


          const theRooms = await Room.findOne(eachRoom).populate('chats')
            .select('-_id chats');

          let notReadChat = 0;
          //각 방의 채팅 내역의 뒤에부터 안읽은채팅 검사를 시작한다.
          for (let i = theRooms.chats.length - 1; i >= 0; i--) {
            //만약 상대가 보낸 채팅이고
            if (theRooms.chats[i].from != jwt.decode(token).token) {
              console.log("상대가 보낸 채팅!");
              //내가 읽지 않았으면
              if (!theRooms.chats[i].isRead) {
                console.log("내가 읽지 않음!");
                ++notReadChat;
              }
              else {
                break;
              }
            }
          }
          //리스트에 안읽을 채팅 수 저장.
          notReadChatList.push(notReadChat);

          const theRoom = theRooms.chats.slice(-1);
          //최근 채팅 한개의 객체를 저장하는 리스트.
          // console.log("theRoom은??"+theRoom);
          // console.log("Chat.findById(theRoom)은?"+await Chat.findById(theRoom));
          chatList.push(await Chat.findById(theRoom));

          //이 방에서 나 말고 상대의 id를 가져온다.
          const audiences = await Room.findOne(eachRoom).select('-_id audiences');
          const name = await User.findOne().where('_id').equals(jwt.decode(token).token)
            .select('-_id nickname');

          if (audiences.audiences[0] != jwt.decode(token).token) {
            const a = await User.findById(audiences.audiences[0])
            //상대의 이름을 저장하는 리스트.
            nameList.push(a.nickname);
            //상대의 _id를 저장하는 리스트.
            idList.push(a._id);
          }
          else {
            const a = await User.findById(audiences.audiences[1])
            //상대의 이름을 저장하는 리스트.
            nameList.push(a.nickname);
            //상대의 _id를 저장하는 리스트.
            idList.push(a._id);
          }
        }

        // chatListtype 객체들을 담은 배열 반환
        return nameList.map((name, index) => ({
          chatList: chatList[index],
          name: name,
          id: idList[index],
          roomId: roomIdList[index],
          notReadChat: notReadChatList[index],
        }));

      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('error occured while getting chat list');
      }
    },

    //이름으로 친구 검색하기. 글자 포함이어도 찾아오기.
    //필요한 데이터 : roomId, 상대 id, 상대 nickname
    searchFriends: async (_, { nickname }, { token }) => {
      try {
        console.log("searchFriends 요청됨");

        let friends = [];
        let friendsRoom = [];

        //검색한 이름이 없으면 null을 반환.
        if (!nickname) return {
          users: friends,
          roomIds: friendsRoom
        };

        tokenValidation(token);

        //내 user를 가져오고 friends객체도 populate한다.
        const friendsObject = await User.findOne({ _id: jwt.decode(token).token })
          .populate({ path: 'friends', populate: { path: 'rooms' } }).select('-_id friends');

        //만든 정규식 regex와 대조하여 내 친구의 nickname중에 포함하는 이름이 있으면
        //그 freind객체를 가져온다.
        //단, 그 친구와의 채팅이력(roomID)가 있으면 roomId도 가져온다.

        friendsObject.friends.map(friend => {

          const regex = MakeRegexByCho(nickname);

          //만약 친구의 이름이 맞다면
          if (regex.test(friend.nickname)) {

            //둘이 사용하는 room이 있는지 없는지에 따라서 flag가 바뀜
            let flag = false;

            //그 친구의 방들을 하나씩 살핀다.
            for (const index in friend.rooms) {

              //만약 둘이 한 채팅 room이 있다면
              if (friend.rooms[index].audiences.includes(jwt.decode(token).token)
                && friend.rooms[index].audiences.includes(jwt.decode(token).token)) {

                //roomid를 넣기
                friendsRoom.push(friend.rooms[index].id);
                flag = true;
                //있으니까 뒤에 나머지 room은 살펴볼 필요 없음.
                break;
              }
              else {
                console.log(friend.nickname + '의' + index + '번째 room 은 대상이 아닙니다');
              }
            };

            //없으면 빈 값 넣기
            if (!flag) friendsRoom.push('');

            //이름이 맞는 친구의 user객체를 push한다.
            friends.push(friend);
          }
        });

        return {
          users: friends,
          roomIds: friendsRoom
        };
      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('error occured while searching freinds');
      }
    },
    getFriends: async (_, args, { token }) => {
      try {
        console.log("getFriends 요청됨")
        tokenValidation(token);

        let friends = [];
        let friendsRoom = [];

        const user = await User.findById(jwt.decode(token).token)
          .populate({ path: 'friends', populate: { path: 'rooms' } }).select('-_id friends').exec();

        user.friends.map(friend => {

          //둘이 사용하는 room이 있는지 없는지에 따라서 flag가 바뀜
          let flag = false;

          //그 친구의 방들을 하나씩 살핀다.
          for (const index in friend.rooms) {

            //만약 둘이 한 채팅 room이 있다면
            if (friend.rooms[index].audiences.includes(jwt.decode(token).token)
              && friend.rooms[index].audiences.includes(jwt.decode(token).token)) {

              //roomid를 넣기
              friendsRoom.push(friend.rooms[index].id);
              flag = true;
              //있으니까 뒤에 나머지 room은 살펴볼 필요 없음.
              break;
            }
            else {
              console.log(friend.nickname + '의' + index + '번째 room 은 대상이 아닙니다');
            }
          };

          //없으면 빈 값 넣기
          if (!flag) friendsRoom.push('');

          //이름이 맞는 친구의 user객체를 push한다.
          friends.push(friend);
        });

        return {
          users: friends,
          roomIds: friendsRoom
        };
      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('Failed to fetch user');
      }
    },

    searchUsers: async (_, { nickname }, { token }) => {
      try {
        console.log("searchUsers 요청됨");

        if (!nickname) { console.log("아무것도 없음"); return ''; }

        const regex = MakeRegexByCho(nickname);

        tokenValidation(token);

        // 나와 친구인 사용자들의 ID를 가져옵니다.
        const friendsIds = await User.findById(jwt.decode(token).token).select('-_id friends').exec();
        friendsIds.friends.push(jwt.decode(token).token);

        // 유저를 nickname으로 검색하고, 나와 친구가 아닌 친구들만 검색 결과로 반환합니다.
        const users = await User.find({ nickname: { $regex: regex }, _id: { $nin: friendsIds.friends } })
          .exec();

        return users;

      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('error occured while searching freinds');
      }
    },

    //서버에서 쿠키(refreshToken)를 보고,
    //verify를 통해서 결정한다.
    //만약 아직 refresh token이 유효하다면 토큰을 새로 발급한다.
    //유효하지 않다면, 아무것도 반환하지 않는다.
    refreshTokenValidation: async (_, { refreshToken }, { token }) => {
      try {
        console.log("refreshTokenValidation 요청됨");

        //refreshtoken이 없으면
        if (!refreshToken) {
          console.log("토큰이 안들어옴 ㅜ");
          return '';
        }

        //refreshtoken이 유효하면
        if (jwt.verify(refreshToken, USER_REFRESH_KEY)) {
          console.log("refreshToken 유효함!!");
          const accesstoken = jwt.sign(
            { token: jwt.decode(refreshToken).token }
            , USER_KEY
            , { expiresIn: "5m", }
          );
          console.log("access token은?" + accesstoken);
          return accesstoken;
        }
        //refreshtoken이 유효하지 않으면
        else {
          console.log("refreshToken 유효하지 않음ㅜㅜ");
          return '';
        }

      } catch (error) {
        console.error(error);
        throw new ApolloError('error occured while refreshTokenValidation');
      }
    },

    //token 유효한지만 검사.
    //RT와 AT를 확인한다. AT가 있으면 AT가 유효한지 검증하고, 유효하면 그대로 반환. 유효하지 않다면(+AT가 없다면) RT를 확인
    //RT가 있으면 검증하고 유효하면 AT 생성해서 반환하고, 유효하지 않으면 ''를 리턴.
    //반환은 무조건 AT나 ''만 함.
    tokenValidation: async (_, { refreshToken }, { token }) => {
      try {
        console.log("TokenValidation 요청됨");

        if (!refreshToken) return '';

        //AT가 있으면
        if (token) {
          //AT가 유효하면
          try {
            jwt.verify(token, USER_KEY);
            return token
          }
          catch {
            try {
              jwt.verify(refreshToken, USER_REFRESH_KEY)
              //AT 생성해서 반환
              const accesstoken = jwt.sign(
                { token: jwt.decode(refreshToken).token }
                , USER_KEY
                , { expiresIn: "5m", }
              );
              console.log("성공2!");
              return accesstoken;
            } catch {
              console.log("실패!");
              return '';
            }
          }
        }
        //AT가 없으면
        else {
          try {
            jwt.verify(refreshToken, USER_REFRESH_KEY);
            const accesstoken = jwt.sign(
              { token: jwt.decode(refreshToken).token }
              , USER_KEY
              , { expiresIn: "5m", }
            );
            console.log("성공3!");
            return accesstoken;
          } catch {
            console.log("실패2!");
            return '';
          }
        }

        if (!token) return false;

        if (jwt.verify(token, USER_KEY)) {
          return true;
        }
        else {
          return false;
        }

      } catch (error) {
        console.error(error);
        throw new ApolloError('error occured while tokenValidation');
      }
    },

    //이 아이디가 내 친구인지 확인
    isMyFriend: async (_, { audienceId }, { token }) => {
      try {
        console.log("isMyFriend 요청됨");

        tokenValidation(token);

        const isMyFriend = await User.findOne({
          _id: jwt.decode(token).token,
          friends: audienceId
        }).exec();

        console.log(isMyFriend);

        return !!isMyFriend;


      } catch (error) {
        console.error(error);
        throw new ApolloError('error occured while refreshTokenValidation');
      }
    },

  },


  //---------------------------------------------------------------------------
  Mutation: {

    //유저 추가하기
    //개발용
    addUser: async (_, { email, password, nickname }) => {
      try {
        console.log("addUser 요청됨");

        const user = new User({ email, password, nickname, isActive: true });
        await user.save();
        return user;
      } catch (error) {
        console.error(error);
        throw new ApolloError('Failed to create user');
      }
    },

    //메시지 보내기
    sendMessage: async (_, { roomId, content, toUser }, { token }) => {
      const session = await startSession();
      try {
        //트렌젝션 시작.
        session.startTransaction();
        console.log("sendMessage 요청됨");

        tokenValidation(token);
        if ((roomId && !validator.isMongoId(roomId)) || !validator.isMongoId(toUser)) {
          throw new ApolloError("room is not valid!")
        };

        //chat 컬렉션에 새로운 채팅 추가하기.
        let now = new Date();
        const thisChat = await Chat.create(
          {
            content: content, createdAt: now,
            from: jwt.decode(token).token, to: toUser,
            isRead: false
          }
        );

        //만약 roomId가 없다면(처음 보내는 메시지라면), roomid는 getchatdata에서가져옴.
        if (roomId == '') {
          //방을 만들고
          roomId = await Room.create({ audiences: [jwt.decode(token).token, toUser] });
          //그리고 user의 room에도 방금 만든 room을 추가한다.
          await User.updateOne({ _id: jwt.decode(token).token }, { $push: { rooms: roomId } });
          await User.updateOne({ _id: toUser }, { $push: { rooms: roomId } });
        }

        //room 객체를 가져와서 보낸 채팅을 room 객체에 참조시킨다.
        await Room.updateOne({ _id: roomId }, { $push: { chats: thisChat } });

        const publishData = await Chat.findById(thisChat._id).populate('from');

        //여기서 roomid도 같이 보내서 payload에 roomid도 같이 들어오게하기
        pubsub.publish('MESSAGE_ADDED', {
          messageAdded: {
            chat: publishData,
            roomId: roomId
          }
        });

        //성공했으면 session을 commit하고 리턴한다
        await session.commitTransaction();

        return true;

      } catch (error) {
        await session.abortTransaction();
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('error occured while sending message');
      } finally {
        await session.endSession();
      }
    },

    //로그인하기 요청
    //일단 보안은 나중에 적용하고 기본적인 코드만 만들자.
    //보안 1 비밀번호 헤싱.
    loginRequest: async (_, { id, password }) => {
      try {
        console.log("loginRequest 요청됨");

        // const user = await User.findOne({ email:id, password:password });
        const user = await User.findOne({ email: id });
        console.log(user);
        const isSame = await bcrypt.compare(password, user.password);
        console.log(isSame);
        if (isSame) {
          //토큰 발급
          const token = jwt.sign({ token: user._id }, USER_KEY, {
            expiresIn: "10h",
          });
          //토큰 발급
          const refreshToken = jwt.sign({ token: user._id }, USER_REFRESH_KEY, {
            expiresIn: "10h",
          });

          console.log("로그인성공!");
          await User.findByIdAndUpdate(user._id, { isActive: true });
          return {
            token: token,
            refreshToken: refreshToken
          };
        }
        else {
          console.log("로그인 실패!");
          return {
            token: '',
            refreshToken: ''
          };
        }
      } catch (error) {
        console.error(error);
        throw new ApolloError('error occured while requesting login');
      }
    },

    //회원가입하기.
    signUp: async (_, { email, password, nickname }) => {
      try {
        console.log("signUp 요청됨");

        if (!validator.isEmail(email)) throw new ApolloError('email form not right');

        const hashedpassword = bcrypt.hashSync(password, 10); //비밀번호 암호화
        const newUser = await User.create(
          {
            email: email, password: hashedpassword,
            nickname: nickname, isActive: false
          }
        );
        //토큰 발급하기.
        const token = jwt.sign({ id: newUser._id }, USER_KEY, {
          expiresIn: "10h",
        });
        return token;
      } catch (error) {
        console.error(error);
        throw new ApolloError('error occured while signing up');
      }
    },

    //친구 추가하기.
    addFriend: async (_, { id }, { token }) => {
      try {
        console.log("addFriend 요청됨");

        tokenValidation(token);
        if (!validator.isMongoId(id)) throw new ApolloError("id not valid");

        //임의로 jun의 것을 가져옴.
        await User.updateOne({ _id: jwt.decode(token).token }, { $push: { friends: id } });
        return true;
      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('error occured while adding friends');
      }
    },

    //로그아웃하기
    logout: async (_, args, { token }) => {
      try {
        console.log("logout 요청됨");

        // const usertoken=tokenValidation(token);
        const usertoken = jwt.decode(token).token;
        console.log("usertoken은 : " + usertoken);

        await User.findByIdAndUpdate(usertoken, { isActive: false });
        // await User.updateOne({ id: usertoken }, { isActive: false });

        return true;
      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('error occured while logout');
      }
    },

    //채팅 읽기 처리(1)
    read: async (_, { roomId }, { token }) => {
      try {
        console.log("read 요청됨");

        tokenValidation(token);

        if (roomId == '') return true;
        // findOne({ email:id })
        const chats = await Room.findOne({ _id: roomId }).populate('chats').select('-_id chats');

        // console.log(chats.chats);

        let notReadChat = 0;
        //각 방의 채팅 내역의 뒤에부터 안읽은채팅 검사를 시작한다.
        for (let i = chats.chats.length - 1; i >= 0; i--) {
          console.log("검사 시작!");;
          //만약 상대가 보낸 채팅이고
          if (chats.chats[i].from != jwt.decode(token).token) {
            console.log("상대가 보낸 채팅!");
            //내가 읽지 않았으면
            if (!chats.chats[i].isRead) {
              console.log("내가 읽지 않음!");
              await Chat.findOneAndUpdate({ _id: chats.chats[i].id }, { isRead: true }, { new: true })
              //여기서 roomid도 같이 보내서 payload에 roomid도 같이 들어오게하기\
              console.log("구독요청보낼것임!! : roomId : " + roomId);
              pubsub.publish('MESSAGE_READ', {
                messageRead: {
                  roomId: roomId,
                  bool: true
                }
              });
            }
            else {
              break;
            }
          }
        }

        return true;
      } catch (error) {
        console.error(error);
        if (error.code == 'TOKEN_ERROR') throw new ApolloError('token error!', 'TOKEN_ERROR');
        throw new ApolloError('error occured while logout');
      }
    },
  },

  Subscription: {
    messageRead: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('MESSAGE_READ'),
        (payload, variables, context) => {
          console.log("messageRead 요청됨");
          // 여기서 필터링 조건을 확인하여 특정 조건에 맞는 채팅만 구독을 허용
          return variables.roomId === payload.messageRead.roomId;
        }
      ),
    },
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('MESSAGE_ADDED'),
        (payload, variables, context) => {
          console.log("messageAdded 요청됨");
          console.log("variables는??????" + variables.roomId);
          console.log("payload는????" + payload.messageAdded.roomId);
          // 여기서 필터링 조건을 확인하여 특정 조건에 맞는 채팅만 구독을 허용
          return variables.roomId === payload.messageAdded.roomId;
        }
      ),
    },

  },

};

export default resolvers;
