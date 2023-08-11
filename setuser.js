

const user1 = new User({
  id: "1",
  password: "password1",
  nickname: "User1",
  sequenceNumber: 123,
  friends: [
    {
      id: "1",
      user: null,
    },
  ],
  chats: [],
});

const user2 = new User({
  id: "2",
  password: "password2",
  nickname: "User2",
  sequenceNumber: 456,
  friends: [
    {
      id: "2",
      user: null,
    },
  ],
  chats: [],
});

const chat = new Chat({
  id: "1",
  content: "Hello, User2!",
  createdAt: new Date("2023-05-08T12:00:00.000Z"),
  from: user1,
  to: user2,
});

user1.friends[0].user = user2;
user1.chats.push(chat);
user2.friends[0].user = user1;
user2.chats.push(chat);

user1.save();
user2.save();
chat.save();
