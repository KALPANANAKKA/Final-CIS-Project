// import all the required libraries

import React, { useEffect, useState, useRef } from "react";
import styles from './styles.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser } from 'react-icons/fa';

// design the messages page
const Messages = ({ socket }) => {

  // messages are stores by using useState hook
  const [messages, setMessages] = useState([]);
  const latestMsgRef = useRef(null);


  useEffect(() => {
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    socket.on('last10', (last10Messages) => {
      // 'Last 100 messages:', JSON.parse(last10Messages));
      last10Messages = JSON.parse(last10Messages);
      console.log('Last 10 messages:', JSON.stringify(last10Messages));
      // Sort these messages by __createdtime__
      last10Messages = sortMessagesByDate(last10Messages);
      setMessages((state) => [...last10Messages, ...state]);
    });

    return () => socket.off('last_100_messages');
  }, [socket]);

  // Scroll to the most recent message
  useEffect(() => {
    latestMsgRef.current.scrollTop =
    latestMsgRef.current.scrollHeight;
  }, [messages]);

  // new message is added to the messages using setMessages function
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log("Msg: " + JSON.stringify(data));
      setMessages((state) =>
        [...state, {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
        ]);
    });

    // turn off the socket
    return () => socket.off('receive_message');
  }, [messages]);



    function sortMessagesByDate(messages) {
      return messages.sort(
        (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
      );
    }

  // function to format date time
  function formatDateTime(timestamp) {

    // timestamp = Date.now();
    // console.log(timestamp);
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  // this page displays all the messages along withe the username and timestamp
  return (
    <div className={styles.messageContainer} ref={latestMsgRef}>
      {messages.map((message, i) =>
        <div key={i} className={styles.message}>
          <div>
            <div className={styles.userName}>
              <FaUser /> {message.username}
            </div>
            <div className={styles.userTime}>{formatDateTime(message.__createdtime__)}

            </div>
            <span className={styles.msg}>~ {message.message}</span>

            <br />
          </div>
        </div>
      )}
    </div>
  );

}

export default Messages;