import { RoomConnectionState } from './RoomConnectionProvider'
import { FC } from 'react'
import TankGame, { coordinates } from './TankGame'

type Props = {
  roomConnection: RoomConnectionState
}

export const WebRTCConnectionProvider: FC<Props> = ({ roomConnection }) => {
  // TODO: This will contain all of the magic: connecting WebRTC and calculating game state.
  // that could be also extracted to multiple functions

  const defaultTankState = {
    color: 0x00ff00,
    dir: { x: 0, y: 0 },
    pos: { x: 100, y: 100 },
  }

  const gameState = {
    wallCoordinates: coordinates,
    tankState: defaultTankState,
  }

  return (
    <>
      <TankGame gameState={gameState} />
    </>
  )
}
