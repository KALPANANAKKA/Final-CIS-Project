// import all the required libraries

import React, { useState } from 'react';
import styles from './styles.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Input } from 'reactstrap';
import { IoSend } from "react-icons/io5";
import InputEmoji from "react-input-emoji";
import Files from 'react-files'
import { RiAttachment2 } from "react-icons/ri";


// design send message component
const SendMessage = ({ socket, username, room }) => {

    // store the current message using useState hook
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);

    const handleChange = (uploadedFiles) => {
        const uploadedFile = uploadedFiles[0];
        setFile(uploadedFile);
        console.log(uploadedFile);
        const __createdtime__ = Date.now();
        const newFileObj = { 'name': uploadedFile.name, 'blob': URL.createObjectURL(uploadedFile), 'room': room, __createdtime__ };
        const newFilesList = [...files, newFileObj];
        setFiles(newFilesList);
        // socket emits send message event
        let message = uploadedFile.name + ' is uploaded successfully';
        socket.emit('send_message', { username, room, message, __createdtime__ });
        socket.emit('upload_file', newFileObj);
    }

    const handleError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }


    // function called when send message button is clicked
    const sendMessage = () => {
        if (message === '') { alert('Please enter a message'); }
        if (message !== ' ') {
            const __createdtime__ = Date.now();
            // socket emits send message event
            socket.emit('send_message', { username, room, message, __createdtime__ });
            setMessage('');
        }
    }

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            const __createdtime__ = Date.now();
            // socket emits send message event
            socket.emit('send_message', { username, room, message, __createdtime__ });
            setMessage('');
        }
    }

    // this page displays text field for message along with the button to send message
    return (
        <div >
            <div className={styles.send_message_inner}>
                <InputEmoji
                    className={styles.inputText}
                    value={message}
                    onChange={setMessage}
                    cleanOnEnter
                    onEnter={handleEnter}
                    placeholder="Type a message"
                />
                <Files

                    className={styles.fileBtn}
                    onChange={handleChange}
                    onError={handleError}
                    accepts={['image/png', '.pdf', 'audio/*']}
                    multiple
                    maxFileSize={10000000}
                    minFileSize={0}
                    clickable>
                    <RiAttachment2 />
                </Files>

                <Button className={styles.sendBtn} onClick={sendMessage}><IoSend /></Button>
            </div>
        </div>
    );
}

export default SendMessage;