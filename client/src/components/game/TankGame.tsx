import { Stage, Text, useApp, useTick } from '@inlet/react-pixi'
import React, { useEffect, useRef, useState } from 'react'
import { FIELD_HEIGHT, FIELD_WIDTH } from '../../config'
import Tank from './canvas-elements/Tank'
import { Wall } from './canvas-elements/Wall'
import { GameScreenControls } from './GameScreenControls'
import { Game, GameState, UserAction, UserActions } from './game-logic/Game'
import { Circle, TextStyle } from 'pixi.js'
import { Projectile } from './canvas-elements/Projectile'
import { useForceUpdate } from '../otherHelpers'

type props = {
  game: Game
  tick: () => void
  isRoot: boolean
}

export const TankGame: React.FC<props> = ({ game, tick, isRoot }) => {
  const forceUpdate = useForceUpdate()
  const gameState = game.gameState

  const app = useApp()
  app.ticker.maxFPS = 70

  useTick((delta, ticker) => {
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
      <Text
        x={FIELD_WIDTH / 2 - 140}
        y={12}
        style={new TextStyle({ fill: ['#fff'] })}
        text={`Score: node: ${gameState.nodeTank.score} vs root: ${gameState.rootTank.score}`}
      />
    </>
  )
}

export default TankGame
