import { Stage } from '@inlet/react-pixi'
import React, { useEffect } from 'react'
import useState from 'react-usestateref'
import { io, Socket } from 'socket.io-client'
import { Menu } from './components/menu/Menu'
import Tank from './components/game/Tank'
import { WallComponent } from './components/game/Wall'
import { Direction, GameState, TankState } from './models/GameState'

interface Props {}

const width = 700
const height = 700

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

interface ConnectionObjects {
  socket: Socket
  connection: RTCPeerConnection
  channel?: RTCDataChannel
}

export const TankGame: React.FC<Props> = ({}) => {
  const [isRoot, setIsRoot] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  const [gameState, setGameState] = useState<GameState>()
  const [connectionObjects, setConnectionObjects, connectionObjectsRef] =
    useState<ConnectionObjects | undefined>(undefined)

  const [currentTankState, setCurrentTankState] = useState<TankState>({
    color: 0x00ff00,
    dir: { x: 0, y: 0 },
    pos: { x: 100, y: 100 },
  })

  const sendSocketIOMessage = (channel: string, message: any) => {
    console.log('sendSocketIOMessage', channel, message)
    const conn = connectionObjectsRef.current!
    conn.socket.emit('message', { channel, message })
  }

  const sendWebRTCData = (data: any) => {
    const stringified = JSON.stringify(data)
    const conn = connectionObjectsRef.current!
    console.log(conn.channel?.readyState)
    if (conn?.channel?.readyState == 'open') {
      conn?.channel?.send(stringified)
    }
  }

  const listenToChannel = (channel: RTCDataChannel) => {
    channel.onmessage = (event) => {
      const parsed: GameState = JSON.parse(event.data)
      console.log('On data channel', parsed)
      setGameState(parsed)
    }
  }

  useEffect(() => {
    const socket = io('ws://localhost:4000')
    const connection = new RTCPeerConnection(configuration)
    setConnectionObjects({
      socket,
      connection,
      channel: undefined,
    })

    connection.ondatachannel = (channelEvent) => {
      console.log('ondatachannel', channelEvent)
      const channel = channelEvent.channel
      setConnectionObjects({ ...connectionObjects!, channel })
      listenToChannel(channel)
    }

    connection.onicecandidate = (iceEvent) => {
      console.log('On ice')
      if (iceEvent.candidate) {
        sendSocketIOMessage(ICE_OFFER, {
          label: iceEvent.candidate.sdpMLineIndex,
          id: iceEvent.candidate.sdpMid,
          candidate: iceEvent.candidate.candidate,
        })
      }
    }

    socket.on(ROOT_OFFER, (message) => {
      console.log('Client received ROOT_OFFER:', message)
      connection
        .setRemoteDescription(message)
        .then(() => connection.createAnswer())
        .then((answer) => connection.setLocalDescription(answer))
        .then(() =>
          sendSocketIOMessage(NODE_OFFER, connection.localDescription)
        )
        .then(() => setConnected(true))
        .catch((err) => console.error(err))
    })

    socket.on(NODE_OFFER, (message) => {
      console.log('Client received NODE_OFFER:', message)
      connection.setRemoteDescription(message)
    })

    socket.on(ICE_OFFER, (message) => {
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate,
      })
      connection.addIceCandidate(candidate)
    })
  }, [])

  const initGame = () => {
    setIsRoot(true)
    const connection = connectionObjects!.connection
    const channel = connection.createDataChannel('sendDataChannel', {})
    setConnectionObjects({ ...connectionObjects!, channel })
    listenToChannel(channel)

    connection
      .createOffer()
      .then((offer) => connection.setLocalDescription(offer))
      .then(() => sendSocketIOMessage(ROOT_OFFER, connection.localDescription))
      .catch((err) => console.error(err))
    setConnected(true)

    channel.onopen = (event) => {
      console.log(event)
    }

    channel.onerror = (event) => {
      console.log(event)
    }

    channel.onclose = (event) => {
      console.log(event)
    }

    //
    // // Add tank to game state
    setGameState({ tankState: currentTankState })
    // sendWebRTCData(gameState);
  }

  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      event.preventDefault()

      let dir: Direction = currentTankState.dir
      switch (event.code) {
        case 'ArrowUp':
          dir = { ...dir, y: -1 }
          break
        case 'ArrowDown':
          dir = { ...dir, y: 1 }
          break
        case 'ArrowLeft':
          dir = { ...dir, x: -1 }
          break
        case 'ArrowRight':
          dir = { ...dir, x: 1 }
          break
      }
      setCurrentTankState((ts) => ({ ...ts, dir }))
    })

    document.addEventListener('keyup', function (event) {
      switch (event.code) {
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowRight':
        case 'ArrowUp':
          setCurrentTankState((ts) => ({ ...ts, dir: { x: 0, y: 0 } }))
          break
      }
    })
  }, [])

  useEffect(() => {
    setGameState({ tankState: currentTankState })
    if (isRoot) {
      sendWebRTCData(gameState)
    }
  }, [currentTankState])

  return (
    <>
      <Menu initGame={initGame} isRoot={isRoot} connected={connected} />
      {connected && (
        <Stage
          width={width}
          height={height}
          options={{ backgroundColor: 0x505152 }}
        >
          <Tank
            tankState={currentTankState}
            setTankState={setCurrentTankState}
          />
          <WallComponent />
        </Stage>
      )}
    </>
  )
}

export default TankGame
