//--데이터 세트 : 2명의 유저
const users = [
    {
      id: "1",
      password: "password1",
      nickname: "User1",
      sequenceNumber: 123,
      friends: [
        {
          id: "1",
          user: {
            id: "2",
          },
        },
      ],
      chats: [
        {
          id: "1",
          content: "Hello, User2!",
          createdAt: "2023-05-08T12:00:00.000Z",
          from: {
            id: "1",
            password: "password1",
            nickname: "User1",
            sequenceNumber: 123,
          },
          to: {
            id: "2",
            password: "password2",
            nickname: "User2",
            sequenceNumber: 456,
          },
        },
      ],
    },
    {
      id: "2",
      password: "password2",
      nickname: "User2",
      sequenceNumber: 456,
      friends: [
        {
          id: "2",
          user: {
            id: "1",
          },
        },
      ],
      chats: [
        {
          id: "1",
          content: "Hello, User2!",
          createdAt: "2023-05-08T12:00:00.000Z",
          from: {
            id: "1",
            password: "password1",
            nickname: "User1",
            sequenceNumber: 123,
          },
          to: {
            id: "2",
            password: "password2",
            nickname: "User2",
            sequenceNumber: 456,
          },
        },
      ],
    },
  ];