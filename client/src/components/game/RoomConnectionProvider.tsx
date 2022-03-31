import { FC, useEffect, useState } from 'react'
import TankGame from './TankGame'
import { io } from 'socket.io-client'
import { WebRTCConnectionProvider } from './WebRTCConnectionProvider'

enum Role {
  UNKNOWN,
  NODE,
  ROOT,
}

export type RoomConnectionState = {
  roomId: string
  playerCnt: number
  role: Role
}

type Props = {
  roomId: string
}

const JOIN_ROOM = 'join_room'
const REPLY_ALL_JOIN_ROOM = 'reply_all_join_room'
type ReplyAllJoinRoomResponse = {
  playerCnt: number
  rootId: string
}

export const RoomConnectionProvider: FC<Props> = ({ roomId }) => {
  const [connectionState, setConnectionState] = useState<RoomConnectionState>({
    roomId,
    role: Role.UNKNOWN,
    playerCnt: 0,
  })

  useEffect(() => {
    const socket = io('ws://localhost:4000')

    socket.emit(JOIN_ROOM, roomId)
    socket.on(
      REPLY_ALL_JOIN_ROOM,
      ({ playerCnt, rootId }: ReplyAllJoinRoomResponse) => {
        setConnectionState({
          ...connectionState,
          playerCnt,
          role: rootId == socket.id ? Role.ROOT : Role.NODE,
        })
      }
    )
  }, [])

  return (
    <>
      <h6>Connection state for nerds:</h6>
      <p>{JSON.stringify(connectionState)}</p>
      <WebRTCConnectionProvider roomConnection={connectionState} />
    </>
  )
}
