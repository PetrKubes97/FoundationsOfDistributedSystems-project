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

const JOIN_ROOM = 'join_room'
const REPLY_ALL_JOIN_ROOM = 'reply_all_join_room'

const peopleCntInRoom = (roomId) => io.sockets.adapter.rooms.get(roomId).size

const updateRoom = (roomId) => {
  const playerCnt = peopleCntInRoom(roomId)
  if (playerCnt === 0) return // We update even when everyone leaves

  const rootId = io.sockets.adapter.rooms.get(roomId).values().next().value

  io.to(roomId).emit(REPLY_ALL_JOIN_ROOM, {
    playerCnt,
    rootId,
  })
}

io.of('/').adapter.on('join-room', (room, id) => {
  updateRoom(room)
})

io.of('/').adapter.on('leave-room', (room, id) => {
  updateRoom(room)
})

io.on('connection', (socket) => {
  console.log('user connected')

  socket.on(JOIN_ROOM, (roomId) => {
    socket.join(roomId)
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
