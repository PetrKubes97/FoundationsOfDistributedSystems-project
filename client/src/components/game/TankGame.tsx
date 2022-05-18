import { Stage, Text, useTick } from '@inlet/react-pixi'
import React, { useEffect, useRef, useState } from 'react'
import { FIELD_HEIGHT, FIELD_WIDTH } from '../../config'
import Tank from './canvas-elements/Tank'
import { Wall } from './canvas-elements/Wall'
import { GameScreenControls } from './GameScreenControls'
import { Game, GameState, UserAction, UserActions } from './game-logic/Game'
import { Circle } from 'pixi.js'
import { Projectile } from './canvas-elements/Projectile'

type props = {
  game: Game
  tick: () => void
  isRoot: boolean
}

const useForceUpdate = () => {
  const [, setValue] = useState(0) // integer state
  return () => setValue((value) => value + 1) // update the state to force render
}

export const TankGame: React.FC<props> = ({ game, tick, isRoot }) => {
  const forceUpdate = useForceUpdate()
  const gameState = game.gameState

  useTick(() => {
    tick()
    // This is the hackiest part by far. Tick updates the state in game class,
    // but that does not trigger re-render, since it's not a state.
    // We can force the re-render with this function.
    forceUpdate()
  })

  return (
    <>
      {gameState.projectiles.map((projectile) => (
        <Projectile x={projectile.position.x} y={projectile.position.y} />
      ))}
      <Tank tankState={gameState.rootTank} />
      <Tank tankState={gameState.nodeTank} />
      <Wall coordinates={gameState.wallCoordinates} />
    </>
  )
}

export default TankGame
