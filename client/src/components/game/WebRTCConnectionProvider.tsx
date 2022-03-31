import { RoomConnectionState } from './RoomConnectionProvider'
import { FC } from 'react'
import TankGame from './TankGame'
import { GameState, UserAction } from '../../models/GameState'
import { map, mapToCoordinates } from './GameHelpers'

type Props = {
  roomConnection: RoomConnectionState
}

export const WebRTCConnectionProvider: FC<Props> = ({ roomConnection }) => {
  // TODO: This will contain all of the magic: connecting WebRTC and calculating game state.
  // that could be also extracted to multiple functions

  const setUserAction = (action: UserAction) => {}

  const defaultTankState = {
    color: 0x00ff00,
    dir: { x: 0, y: 0 },
    pos: { x: 100, y: 100 },
  }

  const gameState: GameState = {
    wallCoordinates: mapToCoordinates(map),
    tanks: [defaultTankState],
  }

  return (
    <>
      <TankGame gameState={gameState} setUserAction={setUserAction} />
    </>
  )
}
