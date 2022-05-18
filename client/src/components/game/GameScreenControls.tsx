import React from 'react'
import TankImage from '../../images/tank.png'
import { GameState, TankState } from './game-logic/Game'
import { Sprite, Stage } from '@inlet/react-pixi'
import { TANK_HEIGHT, TANK_WIDTH } from '../../config'
import Tank from './canvas-elements/Tank'
import TankGame from './TankGame'

interface Props {
  isRoot: boolean
  gameState: GameState
}

const tankSprite = (tank: TankState) => {
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        padding: '5px',
        gap: '5px',
      }}
    >
      <Stage
        width={50}
        height={50}
        options={{ backgroundColor: undefined, backgroundAlpha: 0 }}
      >
        <Sprite
          image={TankImage}
          tint={tank.color}
          width={TANK_WIDTH}
          height={TANK_HEIGHT}
        />
      </Stage>
    </div>
  )
}

export const GameScreenControls: React.FC<Props> = ({ isRoot, gameState }) => {
  const isOpponentRoot = !isRoot

  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <div>
          <div>{`You${isRoot ? ' (root)' : ' (node)'}:`}</div>
          {tankSprite(isRoot ? gameState.rootTank : gameState.nodeTank)}
        </div>
        <div>
          <div>{`Opponent${isOpponentRoot ? ' (root)' : ' (node)'}:`}</div>
          {tankSprite(isRoot ? gameState.nodeTank : gameState.rootTank)}
        </div>
      </div>
    </>
  )
}
