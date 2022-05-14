import React from 'react'
import TankImage from '../../images/tank.png'
import {GameState} from './game-logic/Game'
import { Sprite, Stage } from '@inlet/react-pixi'
import {
  TANK_HEIGHT,
  TANK_WIDTH,
} from '../../config'

interface Props {
  isRoot: boolean
  gameState: GameState
}

const tankSprite = (tint: number) => {
  return (
    <Stage
      width={50}
      height={50}
      options={{ backgroundColor: undefined, backgroundAlpha: 0 }}
    >
      <Sprite
        image={TankImage}
        tint={tint}
        width={TANK_WIDTH}
        height={TANK_HEIGHT}
      />
    </Stage>
  );
};

export const GameScreenControls: React.FC<Props> = ({ isRoot, gameState }) => {
  const isOpponentRoot = !isRoot;

  return (
    <>
      <div style={{ width: '100%' }}>
        <div style={{ width: '50%', height: '100px', float: 'left' }}>
          <div>{`You${isRoot ? ' (root)' : ' (node)'}:`}</div>
            {tankSprite(isRoot ? gameState.rootTank.color : gameState.nodeTank.color)}
        </div>
        <div style={{ marginLeft: '50%', height: '100px' }}>
          <div>{`Opponent${isOpponentRoot ? ' (root)' : ' (node)'}:`}</div>
          {tankSprite(isRoot ? gameState.nodeTank.color : gameState.rootTank.color)}
        </div>
      </div>
    </>
  )
}
