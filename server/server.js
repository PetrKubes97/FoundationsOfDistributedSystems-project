const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const JOIN_ROOM_EV = 'join_room'
const REPLY_JOIN_ROOM_EV = 'reply_join_room'

io.on('connection', (socket) => {
  console.log('an user connected')

  socket.on(JOIN_ROOM_EV, (roomId) => {
    socket.join(roomId)
    socket.emit(REPLY_JOIN_ROOM_EV)
  })

  // Legacy

  socket.on('message', ({ channel, message }) => {
    console.log('broadcasting: ', channel, message)
    socket.broadcast.emit(channel, message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(4000, () => {
  console.log('listening on *:4000')
})
