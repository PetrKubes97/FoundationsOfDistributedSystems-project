import React, { useState } from 'react'
import GreenTank from '../../images/tank.png'
import OrangeTank from '../../images/OpponentTank.png'
import { useSearchParams } from 'react-router-dom'

export const Menu: React.FC = (props) => {
  const [roomToJoinId, setRoomToJoinId] = useState<string>('')
  const [, setSearchParams] = useSearchParams()

  const generateRandomString = (len: number) => {
    return (Math.random() + 1).toString(36).substring(len)
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
