const path = require('path')
const express = require('express')
const http=require('http')
const socketio =require('socket.io')
const formatMessage = require('./utils/messages')
const {userjoin, getCurruntUser, getRoomUsers,userLeave} = require('./utils/users')
const { join } = require('path')


const app = express()
const server = http.createServer(app)

const io = socketio(server)
const PORT = 3000 || process.env.PORT
//set static folder
app.use(express.static(path.join(__dirname,'public')))

const boatName = 'chat bot'

//run when client connect
io.on('connection',socket => {
   socket.on('joinRoom',({username,room}) => {
    const user = userjoin(socket.id,username,room)

    socket.join(user.room)

       //welcome currunt user
    socket.emit('message',formatMessage(boatName,"Welcome To chat application"))

    //broadcast when user connect
     socket.broadcast.to(user.room)
     .emit('message',formatMessage(boatName, `${user.username} has joined the chat`))
    
     //Send user and room info
     io.to(user.room).emit('roomUsers',{
         room: user.room,
         users: getRoomUsers(user.room)
     }) 
    })
   // console.log('New WS connection')
   
   //broadcast for all user
  // io.emit()  
  

  //Listen for chat messaage
  socket.on('chatMessage', (msg) => {
      const user = getCurruntUser(socket.id)
      io.to(user.room).emit('message',formatMessage(user.username,msg))
  })

  //runs when client disconect
  socket.on('disconnect',()=>{
      const user = userLeave(socket.id)
      if(user)
      {
          io.to(user.room).emit('message',formatMessage(boatName,`A ${user.username} has left the chat`))
     
               //Send user and room info
          io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        }) 
        }
})
})

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})