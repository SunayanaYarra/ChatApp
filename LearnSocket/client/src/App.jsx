import React,{useEffect, useState}from 'react'
import{io} from 'socket.io-client'
import {Button,Container,TextField, Typography, } from '@mui/material';
const App=() =>{
  const socket=io("http://localhost:3000/"); //create a socket by giving server side url
  const [message,setMessage]=useState("");
  const handleSubmit=(e)=>{
    e.preventDefault();
    socket.emit("message",message);
  };
  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected",socket.id);
    });
socket.on("received message",(data)=>{
  console.log(data);
});
    socket.on("welcome",(s)=>{
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  },[]);

  return (
    <Container maxWidth="sm">
      <Typography variant='h1' component="div" gutterBottom>
        Welcome to socket.io
      </Typography>
      <form onSubmit={handleSubmit}>
         <TextField value={message} 
         onChange={(e)=>setMessage(e.target.value)}
         id="outlined-basic" label="Outlined" variant="outlined"/>
         <Button type='submit' variant="contained" color="primary">
          Send
         </Button>
      </form>
    </Container>
  )
}

export default App;
