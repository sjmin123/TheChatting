import React from 'react';
import SearchFriends from '../modules/SeachFriends.js';
import { useReactiveVar } from "@apollo/client";
import GetFriends from '../components/newChat/GetFriends.js';


function FriendsListPage() {

  return (
    <div className="container">
      <GetFriends />
    </div>
  );
}

export default FriendsListPage;
