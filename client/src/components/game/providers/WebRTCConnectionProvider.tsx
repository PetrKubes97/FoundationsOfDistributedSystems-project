import { RoomConnection, RoomRole } from './RoomConnectionProvider'
import { FC, useEffect, useState } from 'react'

const ROOT_OFFER = 'root_offer'
const NODE_OFFER = 'node_offer'
const ICE_OFFER = 'ice_offer'

const configuration = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
}

type Props = {
  roomConnection: RoomConnection
  child: (webRtcConnection: WebRTCConnection) => JSX.Element
}

export enum WebRTCState {
  UNINITIALIZED,
  CONNECTED,
  FAILED,
}

type WebRTCConnection = {
  state: WebRTCState
  handlers:
    | {
        sendData: (data: any) => void
        setDataListener: (listener: (data: any) => void) => void
      }
    | undefined
}

export const WebRTCConnectionProvider: FC<Props> = ({
  roomConnection,
  child,
}) => {
  const uninitializedWebRTCState = {
    state: WebRTCState.UNINITIALIZED,
    handlers: undefined,
  }
  const [webRTCConnection, setWebRTCConnection] = useState<WebRTCConnection>(
    uninitializedWebRTCState
  )

  const sendSocketIOMessage = (channel: string, message: any) => {
    roomConnection.handlers?.sendMessageToRoom(channel, message)
  }

  const webRtcLog = (...log: any[]) => {
    console.log('webRtc: ', ...log)
  }

  const handleSuccessfulConnect = (channel: RTCDataChannel) => {
    let localListener: (data: any) => void | undefined
    webRtcLog('handling successful connect')
    channel.onmessage = (ev) => {
      const data = JSON.parse(ev.data)
      webRtcLog('got message', data)
      localListener?.(data)
    }

    setWebRTCConnection({
      state: WebRTCState.CONNECTED,
      handlers: {
        sendData: (data) => {
          const stringified = JSON.stringify(data)
          webRtcLog('sending data', stringified)
          channel.send(stringified)
        },
        setDataListener: (listener) => {
          webRtcLog('setting listener')
          localListener = listener
        },
      },
    })
  }

  useEffect(() => {
    setWebRTCConnection(uninitializedWebRTCState)

    if (
      !roomConnection.handlers ||
      roomConnection.role == RoomRole.UNKNOWN ||
      roomConnection.playerCnt !== 2
    )
      return

    const connection = new RTCPeerConnection(configuration)

    if (roomConnection.role == RoomRole.NODE) {
      webRtcLog('HERE-NODE', roomConnection.playerCnt)
      connection.ondatachannel = (channelEvent) => {
        webRtcLog('ondatachannel', channelEvent)
        const channel = channelEvent.channel
        handleSuccessfulConnect(channel)
      }

      roomConnection.handlers.registerCallback(ROOT_OFFER, (message) => {
        connection
          .setRemoteDescription(message)
          .then(() => connection.createAnswer())
          .then((answer) => connection.setLocalDescription(answer))
          .then(() =>
            sendSocketIOMessage(NODE_OFFER, connection.localDescription)
          )
          .catch((err) => console.error(err))
      })
    } else if (roomConnection.role == RoomRole.ROOT) {
      webRtcLog('HERE-ROOT', roomConnection.playerCnt)
      roomConnection.handlers.registerCallback(NODE_OFFER, (message) => {
        connection.setRemoteDescription(message)
      })

      const channel = connection.createDataChannel('sendDataChannel', {})

      connection
        .createOffer()
        .then((offer) => connection.setLocalDescription(offer))
        .then(() =>
          sendSocketIOMessage(ROOT_OFFER, connection.localDescription)
        )
        .catch((err) => console.error(err))

      const log = (e: Event) => {
        webRtcLog(e)
      }

      channel.onerror = channel.onclose = log
      channel.onopen = () => {
        handleSuccessfulConnect(channel)
      }
    }

    connection.onicecandidate = (iceEvent) => {
      webRtcLog('on ice:', iceEvent)
      if (iceEvent.candidate) {
        sendSocketIOMessage(ICE_OFFER, {
          label: iceEvent.candidate.sdpMLineIndex,
          id: iceEvent.candidate.sdpMid,
          candidate: iceEvent.candidate.candidate,
        })
      }
    }

    roomConnection.handlers.registerCallback(ICE_OFFER, (message) => {
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate,
      })
      connection.addIceCandidate(candidate)
    })

    return () => {
      connection.close()
    }
  }, [roomConnection])

  return (
    <>
      <b>WebRTC connection state for nerds:</b>
      <p>{JSON.stringify(webRTCConnection)}</p>
      {child(webRTCConnection)}
    </>
  )
}
