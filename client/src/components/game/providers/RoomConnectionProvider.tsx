import { FC, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export enum RoomRole {
  UNKNOWN = 'unknown',
  NODE = 'node',
  ROOT = 'root',
}

export type RoomConnection = {
  roomId: string
  playerCnt: number
  role: RoomRole
  handlers:
    | {
        sendMessageToRoom: (channel: string, message: any) => void
        registerCallback: (
          channel: string,
          callback: (data: any) => void
        ) => void
      }
    | undefined
}

type Props = {
  roomId: string
  child: (connection: RoomConnection) => JSX.Element
}

const SEND_MESSAGE_IN_ROOM = 'send_message_in_room'
const JOIN_ROOM = 'join_room'
const REPLY_ALL_JOIN_ROOM = 'reply_all_join_room'

type ReplyAllJoinRoomResponse = {
  playerCnt: number
  rootId: string
}

export const RoomConnectionProvider: FC<Props> = ({ roomId, child }) => {
  const [connectionState, setConnectionState] = useState<RoomConnection>({
    roomId,
    role: RoomRole.UNKNOWN,
    playerCnt: 0,
    handlers: undefined,
  })

  const socketLog = (...log: string[]) => {
    console.log('socket: ', ...log)
  }

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER_URL
    const socket = io(`wss://${url}:4000`)
    socket.emit(JOIN_ROOM, roomId)
    socket.on(
      REPLY_ALL_JOIN_ROOM,
      ({ playerCnt, rootId }: ReplyAllJoinRoomResponse) => {
        setConnectionState({
          ...connectionState,
          playerCnt,
          role: rootId == socket.id ? RoomRole.ROOT : RoomRole.NODE,
          handlers: {
            sendMessageToRoom: (channel, message) => {
              socketLog('sendMessageToRoom', channel, message)
              socket.emit(SEND_MESSAGE_IN_ROOM, { channel, message })
            },
            registerCallback: (channel, callback) => {
              socketLog('registering callback for', channel)
              socket.off(channel)
              socket.on(channel, (data) => {
                socketLog('receivedMessage', channel, data)
                callback(data)
              })
            },
          },
        })
      }
    )
  }, [])

  return (
    <>
      <b>Connection state for nerds:</b>
      <p>{JSON.stringify(connectionState)}</p>
      {child(connectionState)}
    </>
  )
}
