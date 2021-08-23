const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3000;
const http = require('http');
const socketio = require('socket.io');
const{ joinUser,getUser,userLeft,getUsersInRoom} = require('./modules/users')
const{jointyper,typerLeft,gettypersInRoom} = require('./modules/typers')



const app = express();
const server = http.createServer(app);
const io = socketio(server);



app.use(express.static(path.join(__dirname,'public')));

io.on('connection',socket=>{
  socket.on('user_joined_room',({username,roomname})=>{
    if(roomname=='readonly'){
      socket.emit('readonly');
    }else{
      //save user to users array.
      const user = joinUser(socket.id,username,roomname);
      socket.join(user.roomname);
      //send wellcom message to the user who joined.
      socket.emit('message',
          {from:'server',text:`wellcom ${user.username}`,time:gettime()})
      //send everyone in the room a message that a user has joined.
      socket.broadcast.to(user.roomname).emit('message',
          {from:'server',text:`${user.username} logged in`,time:gettime()})
      //update conected users list in the room.
      io.to(user.roomname).emit('onlineUsersUpdate',{usersList:getUsersInRoom(user.roomname),roomname:user.roomname})
      //update typing users list in the room.
      io.to(user.roomname).emit('typingUsersUpdate',gettypersInRoom(user.roomname))
  }
})
  //reciving message from user
  socket.on('messageFromChat',message=>{
    const user = getUser(socket.id);
    //send the message to everyone in the same room.
    io.to(user.roomname).emit('message',{from:user.username,text: message,time:gettime()});
  })
  //tracking typing event
  socket.on('typing',({username,roomname})=>{
    const typer = jointyper(socket.id,username,roomname);
    io.to(typer.roomname).emit('typingUsersUpdate',gettypersInRoom(typer.roomname))
})
  //tracking stop typing event
  socket.on('stopTyping',()=>{
    const typer = typerLeft(socket.id);
    if(typer){
      io.to(typer.roomname).emit('typingUsersUpdate',gettypersInRoom(typer.roomname))
    }
  })
  //remove user info from arrays when user is disconnected
  socket.on('disconnect',()=>{
    const user = userLeft(socket.id);
    typerLeft(socket.id);
    if(user){
      io.to(user.roomname).emit('typingUsersUpdate',gettypersInRoom(user.roomname))
      io.to(user.roomname).emit('message',{from:'server',text:`${user.username} left`,time:gettime()});
      io.to(user.roomname).emit('onlineUsersUpdate',{usersList:getUsersInRoom(user.roomname),roomname:user.roomname})
    }
  
  })
})



function gettime(){
  let date_ob = new Date();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  return `${hours}:${minutes}`
}


server.listen(PORT);