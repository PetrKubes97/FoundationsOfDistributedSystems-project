import React, { useState } from 'react'
import GreenTank from '../../images/tank.png'
import OrangeTank from '../../images/OpponentTank.png'

interface Props {
  createRoom: () => void
  joinRoom: (id: string) => void
}

export const Menu: React.FC<Props> = ({ createRoom, joinRoom }) => {
  const [roomToJoinId, setRoomToJoinId] = useState<string>('')

  return (
    <div id={'menuContainer'}>
      <p>The Great Game of Tanks</p>
      <button onClick={createRoom}>Create room</button>
      <div id={'joinRoomContainer'}>
        <button onClick={() => joinRoom(roomToJoinId)}> Join room</button>
        <input
          type={'text'}
          value={roomToJoinId}
          onChange={(e) => setRoomToJoinId(e.target.value)}
        />
      </div>
    </div>
  )
}
