import express from 'express';
import { Server, Socket } from 'socket.io';
import {createServer} from "http";
import cors from 'cors';
const port=3000;
const app=express();
const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    },
});
app.use(cors()); //use method is a way to apply middleware to your application. 
// Middleware are functions that have access to the request and response objects
// to enable Cross-Origin Resource Sharing (CORS) middleware. 

app.get("/",(req,res)=>{
    res.send('Hello World!');
});
let counter=0;
io.on("connection",(socket)=>{ //Connection is an event and socket is an individual socket
    counter++;
    console.log(`User${counter} connected`);
    console.log("Id",socket.id);
    socket.on("message",(data)=>{
        console.log(data);
        // io.emit("received message",data);
        socket.broadcast.emit("received message",data);
    });
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    });
});
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});