//Node server which will handle socket io connections
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const cors=require('cors');
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
    pingInterval: 10000,  // Ping every 10 seconds
    pingTimeout: 5000 
});
const users={};
io.on('connection',(socket)=>{
    //If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined',(name)=>{
        console.log("New user",name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name)
    });
    //If someone sends a message, broadcast it to other people
    socket.on('send_msg',(message)=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    });
//If someone leaves the chat , let others know. And this is a built-in event
    socket.on('disconnect', () => {
         console.log(`${users[socket.id]} disconnected`);
          socket.broadcast.emit('left', users[socket.id]); 
          delete users[socket.id]; 
        }); 
    });
app.get('/',(req,res)=>{
    res.send("Hello welcome to chat application");
});
const PORT=8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
