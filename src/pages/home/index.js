// import all the required libraries

import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Input } from 'reactstrap';

// design of the component

const Home = ({username, setUsername, room, setRoom, socket}) => {
    // navigate for different routes
    const navigate = useNavigate();

    // function called when clicked on JoinRoom button
    const joinRoom = () => {
        // is username and room details are given, person can join the room
        if(username === ''){ alert('Please enter user name'); }
        if(room === ''){ alert('Please enter room name'); }
        
        if(room !== '' && username !== ''){
            // socket emits join_room event
            socket.emit('join_room', {username, room});
            
            // Generate a unique identifier for the chat session
            // const sessionId = generateSessionId();

            // Redirect to the chatroom page and pass the username as a query parameter
            // window.open(`/chat?sessionId=${sessionId}&username=${username}&room=${room}`, '_blank');
            navigate("/chat");
            
        }


    }

    // const generateSessionId = () => {
    //     // Generate a unique identifier (you can use any method for this)
    //     return Math.random().toString(36).substr(2, 9);
    // };

    return (
        <div className={styles.page}>
                    <div className={styles.container}>
            <div className={styles.heading}>
            <h1>Kalpana ChatRooms</h1>
            </div>
            {/* designing the form with username, select list and button */}
            <div className={styles.form}>
                <Input
                    type='text' 
                    placeholder="Username...."
                    onChange={(e) => setUsername(e.target.value)}
                    // setUsername is called with the target value whenever username changes
                />
                <Input type='text' placeholder="channel name"
                    onChange={(e) => setRoom(e.target.value)}
                    // setRoom is called with the target value whenever username changes
                />
                {/* onClick event is registered for the button whenever it is clicked. */}
                <Button className={styles.joinBtn} onClick={joinRoom}>Join Room</Button>
            </div>
        </div>
        </div>
    );
}

export default Home;