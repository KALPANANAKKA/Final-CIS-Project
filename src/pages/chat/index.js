// import all the required libraries

import React, { useEffect } from 'react';
import MessagesReceived from './messages';
import SendMessage from './send-message';
import RoomAndUsersColumn from './room-and-users';
import styles from './styles.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Attachments from './attachments'


// design the chat room and users

const Chat = ({socket, username, room}) => {

    return (
        // this page adds 3 components - rooms and users, messages, send messages components
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.users}>
                    <RoomAndUsersColumn socket={socket} username={username} room={room} />
                </div>
                <div>
                    <div className={styles.messages}>
                        <MessagesReceived socket={socket} />
                    </div>
                    <div className={styles.send_message}>
                        <SendMessage socket={socket} username={username} room={room} />
                    </div>
                </div>
                <div className={styles.attachments}>
                        <Attachments socket={socket} room={room}/>
                </div>
            </div>
        </div>
    );
}

export default Chat;