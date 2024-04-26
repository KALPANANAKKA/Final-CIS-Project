// add all the required libraries
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const dbSaveMessage = require('./services/db-save-message');
const dbGetMessages = require('./services/db-get-messages');
const dbUploadFile = require('./services/db-upload-file');
const dbGetFiles = require('./services/db-get-files');
const leaveRoom = require('./utils/leave-room');
const { emit } = require('process');
const { all } = require('axios');

app.use(cors()); // Add cors middleware

// create server instance
const server = http.createServer(app); // Add this

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const CHAT_BOT = 'ChatBot';
let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room

// Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  // Add a user to a room
  socket.on('join_room', (data) => {
    const { username, room } = data; // Data sent from client when join_room event emitted
    socket.join(room);

    console.log(`${username} joined the chat`);

    // fetch the latest 10 messages from the database
    dbGetMessages(room).then((last10Msgs) => {
      console.log(`fetched last 10 messages from the database`);
      socket.emit('last10', last10Msgs);
    }).catch((err) => {
      console.log(err);
    });

    // fetch the latest attachments from the database
    dbGetFiles(room).then((lastFiles) => {
      console.log(`fetched latest attachments from the database`);
      socket.emit('getLastFiles', lastFiles);
    }).catch((err) => {
      console.log(err);
    });

    let __createdtime__ = Date.now(); // Current timestamp
    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit('receive_message', {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__: __createdtime__,
    });
    // Send welcome msg to user that just joined chat only
    socket.emit('receive_message', {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__: __createdtime__
    });
    // Save the new user to the room
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    console.log(JSON.stringify(chatRoomUsers));
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    // console.log("yes");
    socket.emit('chatroom_users', chatRoomUsers);
  });



  // send a message
  socket.on('send_message', (data) => {
    const { message, username, room, __createdtime__ } = data;
    io.in(room).emit('receive_message', data); // Send to all users in room, including sender
    dbSaveMessage(message, username, room, __createdtime__) // Save message in db
  });

    // send a message
    socket.on('upload_file', (data) => {
      console.log("inside");
      const { name, blob } = data;
      io.in(data.room).emit('receive_file', data);
      dbUploadFile(data) // Save file in db
    });

  // leave the room
  socket.on('leave_room', (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    // Remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit('chatroom_users', allUsers);
    socket.to(room).emit('receive_message', {
      username: CHAT_BOT,
      message: `${username} has left the chat`,
      __createdtime__: __createdtime__
    });
    console.log(`${username} has left the chat`);
  });

  // disconnect from the server
  socket.on('disconnect', () => {
    console.log('User disconnected from the chat');
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit('chatroom_users', allUsers);
      socket.to(chatRoom).emit('receive_message', {
        message: `${user.username} has disconnected from the chat.`,
      });
    }
  });

});

// server is listening at port 4000
server.listen(4000, () => 'Server is running on port 4000');