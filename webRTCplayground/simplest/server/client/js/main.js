"use strict"

// TODO: try to make it work according to this tutorial https://www.html5rocks.com/en/tutorials/webrtc/basics/

const txtSend = document.querySelector("textarea#txtSend")
const txtReceive = document.querySelector("textarea#txtReceive")

const btnStart = document.querySelector("button#btnStart")
const btnChannel = document.querySelector("button#btnChannel")
const btnSend = document.querySelector("button#btnSend")
const btnClose = document.querySelector("button#btnClose")

const socket = io()

const ROOT_OFFER = "root_offer"
const NODE_OFFER = "node_offer"
const ICE_OFFER = "root_ice_offer"

let isRoot = false

const connection = new RTCPeerConnection()
connection.ondatachannel = (channelEvent) => {
    console.log(channelEvent)
}
connection.onicecandidate = (iceEvent) => {
    console.log(iceEvent)
    if (iceEvent.candidate) {
        sendMessage(ICE_OFFER, {
            label: iceEvent.candidate.sdpMLineIndex,
            id: iceEvent.candidate.sdpMid,
            candidate: iceEvent.candidate.candidate
        })
    }
}

// localConnection.onicecandidate = e => !e.candidate
//     || remoteConnection.addIceCandidate(e.candidate)
//         .catch(handleAddCandidateError);

let channel
const sendData = () => {
    channel.send("testing message")
}

const initializeConnection = () => {
    isRoot = true

    const channelChangedCallback = (e) => {
        console.log(e)
    }

    channel = connection.createDataChannel("sendDataChannel", null)
    channel.onopen = channelChangedCallback
    channel.onclose = channelChangedCallback
    channel.onmessage = (event) => {
        trace("Received Message")
        txtReceive.value = event.data
    }

    connection.createOffer()
        .then(offer => connection.setLocalDescription(offer))
        .then(() => sendMessage(ROOT_OFFER, connection.localDescription))
        .catch(handleDescriptionError)
}


btnStart.disabled = true
btnClose.disabled = false


socket.on("message", (message) => {
    console.log("Client received message:", message)
})

socket.on(ROOT_OFFER, (message) => {
    console.log("Client received message:", message)
    connection.setRemoteDescription(message)
        .then(() => connection.createAnswer())
        .then((answer) => connection.setLocalDescription(answer))
        .then(() => sendMessage(NODE_OFFER, connection.localDescription))
        .catch(handleDescriptionError)
})

socket.on(NODE_OFFER, (message) => {
    console.log("Client received message:", message)
    connection.setRemoteDescription(message)
})

socket.on(ICE_OFFER, (message) => {
    const candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
    })
    connection.addIceCandidate(candidate)
})

const sendMessage = (channel, message) => {
    console.log("Client sending message: ", message, channel)
    socket.emit("message", message)
}

const handleDescriptionError = (e) => console.error(e)


btnChannel.onclick = initializeConnection
btnSend.onclick = sendData
// btnClose.onclick = closeDataChannels

