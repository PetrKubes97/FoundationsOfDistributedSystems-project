import { Stage } from '@inlet/react-pixi'
import React, { useEffect } from 'react'
import useState from 'react-usestateref'
import { io, Socket } from 'socket.io-client'
import { FIELD_HEIGHT, FIELD_WIDTH } from '../../config'
import {
  Coordinate,
  Direction,
  GameState,
  TankState,
  UserAction,
} from '../../models/GameState'
import Tank from './canvas-elements/Tank'
import { Wall } from './canvas-elements/Wall'
import { GameScreenControls } from './GameScreenControls'

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

export const coordinates: Coordinate[] = [
  { x: 175, y: 25 },
  { x: 175, y: 75 },
  { x: 175, y: 125 },
  { x: 25, y: 275 },
  { x: 75, y: 275 },
  { x: 125, y: 275 },
  { x: 175, y: 275 },
  { x: 225, y: 275 },
  { x: 275, y: 275 },
  { x: 425, y: 275 },
  { x: 475, y: 275 },
  { x: 525, y: 275 },
  { x: 575, y: 275 },
  { x: 625, y: 275 },
  { x: 675, y: 275 },
  { x: 275, y: 375 },
  { x: 275, y: 425 },
  { x: 275, y: 475 },
  { x: 525, y: 675 },
  { x: 525, y: 625 },
  { x: 525, y: 575 },
  { x: 275, y: 325 },
]

const defaultTankState = {
  color: 0x00ff00,
  dir: { x: 0, y: 0 },
  pos: { x: 100, y: 100 },
}

type props = {
  gameState: GameState
  setUserAction: (action: UserAction) => void
}

export const TankGame: React.FC<props> = ({ gameState, setUserAction }) => {
  // TODO: This one will be super simple
  // it will only a) display the game state it gets
  // b) notify about player actions

  const [isRoot, setIsRoot] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  const [gameStateTODO, setGameStateTODO] = useState<GameState>({
    wallCoordinates: coordinates,
    tankState: defaultTankState,
  })
  const [connectionObjects, setConnectionObjects, connectionObjectsRef] =
    useState<ConnectionObjects | undefined>(undefined)

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
      setGameStateTODO(parsed)
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

    return () => {
      connection.close()
    }
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

    // Add tank to game state
    setGameStateTODO({
      tankState: defaultTankState,
      wallCoordinates: coordinates,
    })
    // sendWebRTCData(gameStateTODO);
  }

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      event.preventDefault()

      let dir: Direction = gameStateTODO?.tankState.dir
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
      setGameStateTODO((old) => ({
        ...old,
        tankState: { ...old.tankState, dir },
      }))
    }

    const keyUpEvent = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowRight':
        case 'ArrowUp':
          setGameStateTODO((old) => ({
            ...old,
            tankState: { ...old.tankState, dir: { x: 0, y: 0 } },
          }))
          break
      }
    }

    document.addEventListener('keydown', keyDownListener)
    document.addEventListener('keyup', keyUpEvent)

    return () => {
      document.removeEventListener('keydown', keyDownListener)
      document.removeEventListener('keyup', keyUpEvent)
    }
  }, [])

  const setTankState = (updateTankState: (ts: TankState) => TankState) => {
    setGameStateTODO((old) => ({
      ...old,
      tankState: updateTankState(old.tankState),
    }))
  }

  return (
    <>
      <GameScreenControls isRoot={isRoot} />
      {connected && (
        <Stage
          width={FIELD_WIDTH}
          height={FIELD_HEIGHT}
          options={{ backgroundColor: 0x505152 }}
        >
          <Tank
            tankState={gameStateTODO?.tankState}
            setTankState={setTankState}
            wallCoordinate={gameStateTODO?.wallCoordinates}
          />
          <Wall coordinates={gameStateTODO?.wallCoordinates} />
        </Stage>
      )}
    </>
  )
}

export default TankGame
