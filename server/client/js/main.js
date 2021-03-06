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
const ICE_OFFER = "ice_offer"

const configuration = {
    iceServers: [
        {
            urls: "stun:openrelay.metered.ca:80"
        },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject"
        }
    ]
}

const connection = new RTCPeerConnection(configuration)


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

const updateRoot = (data, gameState) => {
    return {
        ...gameState,
        root: {
            ...gameState.root,
            ...data
        }
    }
}

const updateNode = (data, gameState) => {
    return {
        ...gameState,
        node: {
            ...gameState.node,
            ...data
        }
    }
}

const goTop = () => {
    if (isRoot) {
        updateGameState(updateRoot({y: gameState.root.y - 10}, gameState))
    } else {
        sendData(updateNode({y: gameState.node.y - 10}, gameState))
    }
}

const goDown = () => {
    if (isRoot) {
        updateGameState(updateRoot({y: gameState.root.y + 10}, gameState))
    } else {
        sendData(updateNode({y: gameState.node.y + 10}, gameState))
    }
}

const goLeft = () => {
    if (isRoot) {
        updateGameState(updateRoot({x: gameState.root.x - 10}, gameState))
    } else {
        sendData(updateNode({x: gameState.node.x - 10}, gameState))
    }
}

const goRight = () => {
    if (isRoot) {
        updateGameState(updateRoot({x: gameState.root.x + 10}, gameState))
    } else {
        sendData(updateNode({x: gameState.node.x + 10}, gameState))
    }
}

btnTop.onclick = goTop
btnDown.onclick = goDown

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        goTop()
    } else if (event.key === "ArrowDown") {
        goDown()
    } else if (event.key === "ArrowRight") {
        goRight()
    } else if (event.key === "ArrowLeft") {
        goLeft()
    }
})

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

