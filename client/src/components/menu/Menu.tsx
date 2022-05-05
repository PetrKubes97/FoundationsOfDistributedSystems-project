import React, { useState } from 'react'
import GreenTank from '../../images/tank.png'
import OrangeTank from '../../images/OpponentTank.png'
import { useSearchParams } from 'react-router-dom'

export const Menu: React.FC = (props) => {
  const [roomToJoinId, setRoomToJoinId] = useState<string>('')
  const [, setSearchParams] = useSearchParams()

  const generateRandomString = (length: number) => {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const goToRoom = (roomId: string) => {
    setSearchParams({ roomId })
  }

  return (
    <div id={'menuContainer'}>
      <p>The Great Game of Tanks</p>
      <button onClick={() => goToRoom(generateRandomString(6))}>
        Create room
      </button>
      <div id={'joinRoomContainer'}>
        <button
          disabled={roomToJoinId.length !== 6}
          onClick={() => goToRoom(roomToJoinId)}
        >
          {' '}
          Join room
        </button>
        <input
          placeholder={'room id'}
          type={'text'}
          value={roomToJoinId}
          onChange={(e) => {
            console.log('asdf')
            setRoomToJoinId(e.target.value)
          }}
        />
      </div>
    </div>
  )
}
