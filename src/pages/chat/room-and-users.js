// import all the required libraries

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Input } from 'reactstrap';
import { IoPersonSharp } from "react-icons/io5";
import { FaLink } from "react-icons/fa";



// design the rooms and users page

const RoomAndUsers = ({ socket, username, room }) => {
  // stores the list of users
  const [roomUsers, setRoomUsers] = useState([]);

  // navigate to the corresponding page
  const navigate = useNavigate();

  // update roomUsers with the available users and rooms details
  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log("data: " + JSON.stringify(data));
      setRoomUsers(data);
    });
    console.log("inside useeffect");

    return () => socket.off('chatroom_users');
  }, [socket]);

  // function called when leaveRoom button is clicked
  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    // socket emits leaveRoom event
    socket.emit('leave_room', { username, room, __createdtime__ });
    // Redirect to home page
    navigate('/', { replace: true });
  };

  const createChannelLink = () => {
    const __createdtime__ = Date.now();
    // socket emits send message event
    let message = `http://localhost:3000/chat/${room}`;
    socket.emit('send_message', { username, room, message, __createdtime__ });
  }

  // this page displays room name, list of available users, leave button
  return (
    <div>
      <h2 className={styles.heading}>{room}</h2>
      <Button className={styles.leaveBtn} onClick={leaveRoom}>
      {username} can Leave from here
              </Button>
      <div>
        {roomUsers.length > 0 && <h5 className={styles.userHeading}>Users:</h5>}
        <ul>
          {roomUsers.map((user) => (
            <li className={styles.usersList}
              key={user.id}
            >
              <IoPersonSharp /> {user.username} <FaLink onClick={createChannelLink}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomAndUsers;