const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const {Server} = require("socket.io")
const io = new Server(server)

app.use(express.static("client"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html")
})

io.on("connection", (socket) => {
    console.log("a user connected")

    socket.on("message", (message) => {
        console.log("broadcasting")
        socket.broadcast.emit('message', message)
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})
server.listen(3000, () => {
    console.log("listening on *:3000")
})