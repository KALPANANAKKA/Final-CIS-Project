// import all the required libraries

import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Chat from './pages/chat';
import Channel from './pages/channel'

import io from 'socket.io-client';

// connect to server on port 4000
const socket = io.connect("http://localhost:4000");

function App() {

  // useState hook to maintain username and room name
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');


  return (
    <Router>

      <div className="App">
        {/*
          defining routes to have navigation
          1. path = "/" => is for home page
          2. path = "/chat" => is for chat page
        */}
        <Routes>
        {/* Home component is to display the home page, which needs username, room, socket info 
        and functions to maintain username and room value changes */}
          <Route path="/" element=
            {<Home
              username={username}
              setUsername={setUsername}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />} />

          {/* to make user join the existing channel using link */}
          <Route path="/chat/:room" element=
            {<Channel
              username={username}
              setUsername={setUsername}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />} />
            
          {/* Chat component is to display the Chat page, which needs username, room, socket info. */}
          <Route path="/chat" element=
            {<Chat 
              socket={socket}
              username={username}
              room={room}
              />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
