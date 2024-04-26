// import all the required libraries

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';


// design the chat room and users

const Attachments = ({ socket, room }) => {

    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        socket.on('getLastFiles', (lastFiles) => {
            lastFiles = JSON.parse(lastFiles);
            console.log('Last files:', JSON.stringify(lastFiles));
            lastFiles = sortMessagesByDate(lastFiles);
            setAttachments((state) => [...lastFiles, ...state]);
        });

        return () => socket.off('last_100_messages');
    }, [socket]);

    // new message is added to the messages using setMessages function
  useEffect(() => {
    socket.on('receive_file', (data) => {
      console.log("Msg: " + JSON.stringify(data));
      setAttachments((state) =>
        [...state, {
          name: data.name,
          room: data.room,
          blob: data.blob,
          __createdtime__: data.__createdtime__,
        },
        ]);
    });

    // turn off the socket
    return () => socket.off('receive_file');
  }, [attachments]);

    function sortMessagesByDate(messages) {
        return attachments.sort(
            (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }
    return (
        <div className={styles.attachments}>
            <h2 className={styles.heading1}>Attachments</h2>
            {attachments && attachments.map((attachment, i) =>
                <div key={i}>
                    <a href={attachment.blob} download={attachment.name}>{attachment.name}</a>
                </div>
            )}
        </div>
    );
}

export default Attachments;