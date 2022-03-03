"use strict"

const txtReceive = document.querySelector("textarea#txtReceive")

const btnCreate = document.querySelector("button#btnCreate")
const btnSend = document.querySelector("button#btnSend")
const btnClose = document.querySelector("button#btnClose")

const btnTop = document.querySelector("button#top")
const btnDown = document.querySelector("button#down")

const cnvsGame = document.querySelector("canvas#cnvsGame")

///// GAME
const ctx = cnvsGame.getContext("2d")
ctx.fillStyle = "#a4ce81"
ctx.fillRect(0, 0, 300, 300)

let gameState = {
    root: {
        x: 0,
        y: 0
    },
    node: {
        x: 200,
        y: 200
    }
}

let isRoot = false

/////
const socket = io()

const ROOT_OFFER = "root_offer"
const NODE_OFFER = "node_offer"
const ICE_OFFER = "root_ice_offer"


const connection = new RTCPeerConnection()


/////
const listenToChannel = () => {
    channel.onmessage = (event) => {
        txtReceive.value = txtReceive.value.concat("\n" + event.data)
        const parsed = JSON.parse(event.data)
        console.log(parsed)
        updateGameState(parsed)
    }
}

let channel
connection.ondatachannel = (channelEvent) => {
    console.log("ondatachannel", channelEvent)
    channel = channelEvent.channel
    listenToChannel()
}

connection.onicecandidate = (iceEvent) => {
    console.log("onIceCandidate:", iceEvent)
    if (iceEvent.candidate) {
        sendMessage(ICE_OFFER, {
            label: iceEvent.candidate.sdpMLineIndex,
            id: iceEvent.candidate.sdpMid,
            candidate: iceEvent.candidate.candidate
        })
    }
}

const sendData = (data) => {
    const stringified = JSON.stringify(data)
    channel.send(stringified)
}

const initializeConnection = () => {
    isRoot = true
    channel = connection.createDataChannel("sendDataChannel", null)
    listenToChannel()

    connection.createOffer()
        .then(offer => connection.setLocalDescription(offer))
        .then(() => sendMessage(ROOT_OFFER, connection.localDescription))
        .catch(handleDescriptionError)
}


btnClose.disabled = false

socket.on("message", (message) => {
    console.log("Client received message:", message)
})

socket.on(ROOT_OFFER, (message) => {
    console.log("Client received ROOT_OFFER:", message)
    connection.setRemoteDescription(message)
        .then(() => connection.createAnswer())
        .then((answer) => connection.setLocalDescription(answer))
        .then(() => sendMessage(NODE_OFFER, connection.localDescription))
        .catch(handleDescriptionError)
})

socket.on(NODE_OFFER, (message) => {
    console.log("Client received NODE_OFFER:", message)
    connection.setRemoteDescription(message)
})

socket.on(ICE_OFFER, (message) => {
    const candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label, candidate: message.candidate
    })
    connection.addIceCandidate(candidate)
})

const sendMessage = (channel, message) => {
    console.log("Client sending message: ", message, channel)
    socket.emit("message", {channel, message})
}

const handleDescriptionError = (e) => console.error(e)

btnCreate.onclick = initializeConnection
btnSend.onclick = sendData

btnTop.onclick = () => {
    if (isRoot) {
        updateGameState(
            {
                ...gameState,
                root: {
                    ...gameState.root,
                    y: gameState.root.y - 10
                }
            })
    } else {
        sendData(
            {
                ...gameState,
                node: {
                    ...gameState.node,
                    y: gameState.node.y - 10
                }
            }
        )
    }
}

btnDown.onclick = () => {
    if (isRoot) {
        updateGameState(
            {
                ...gameState,
                root: {
                    ...gameState.root,
                    y: gameState.root.y + 10
                }
            })
    } else {
        // TODO, send only the delta
        sendData(
            {
                ...gameState,
                node: {
                    ...gameState.node,
                    y: gameState.node.y + 10
                }
            }
        )
    }
}


const updateGameState = (newGameState) => {
    gameState = newGameState
    if (isRoot) {
        sendData(newGameState)
    }

    // Resets
    ctx.fillStyle = "#a4ce81"
    ctx.fillRect(0, 0, 300, 300)

    ctx.fillStyle = "#ff4444"
    ctx.fillRect(newGameState.root.x, newGameState.root.y, 50, 50)

    ctx.fillStyle = "#467eff"
    ctx.fillRect(newGameState.node.x, newGameState.node.y, 50, 50)
}

