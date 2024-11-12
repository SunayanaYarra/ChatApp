
const socket = io('http://localhost:8000', {
    reconnectionAttempts: 3,  // Number of attempts to reconnect
    reconnectionDelay: 1000,  // Delay between reconnections
    timeout: 5000             // Timeout duration in ms
});
//Get DOM elements in a JS variables.
const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector('.container');
//AUdio willp play on receiving messages
var audio=new Audio('js/sound.mp3');
//Function which will append event info to the container
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
    
}
//If form gets submiited, send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send_msg',message);
    messageInput.value='';
})
//ASk new user for name and the let the server know
const name=prompt("Enter your name to join");
socket.emit('new-user-joined',name);
//If a new user joins, receive name from server
socket.on('user-joined',(name)=>{
    append(`${name} joined the chat`,'right');
});
//if server sends a msg, receive it
socket.on('receive',(datas)=>{
    append(`${datas.name}:${datas.message}`,'left');
});
//If a user leaves the chat, append the info to the container
socket.on('left', (name) => { console.log(`${name} left the chat`); append(`${name} left the chat`, 'left'); });

