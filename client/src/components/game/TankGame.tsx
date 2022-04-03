import { Stage, Text, useTick } from '@inlet/react-pixi'
import React, { useEffect, useRef, useState } from 'react'
import { FIELD_HEIGHT, FIELD_WIDTH } from '../../config'
import Tank from './canvas-elements/Tank'
import { Wall } from './canvas-elements/Wall'
import { GameScreenControls } from './GameScreenControls'
import {
  Direction,
  GameState,
  UserAction,
  UserActions,
} from './game-logic/Game'

type props = {
  gameState: GameState
  currentUserActions: UserActions
  updateUserAction: (action: UserAction) => void
  tick: () => void
  isRoot: boolean
}

const useForceUpdate = () => {
  const [, setValue] = useState(0) // integer state
  return () => setValue((value) => value + 1) // update the state to force render
}

export const TankGame: React.FC<props> = ({
  gameState,
  currentUserActions,
  updateUserAction,
  tick,
  isRoot,
}) => {
  const forceUpdate = useForceUpdate()
  const currentUserAction = isRoot
    ? currentUserActions.rootAction
    : currentUserActions.nodeAction

  // Ref is necessary since I don't want to reassign key listeners every time
  // the state changes. Other, maybe better option would be to move key listeners
  // to other component and just rebuild the game state
  const actionRef = useRef(currentUserAction)
  actionRef.current = currentUserAction

  useEffect(() => {
    const keyListener = (isUp: boolean) => (event: KeyboardEvent) => {
      event.preventDefault()

      // TODO: For better responsivity, keep track of which keys are pressed
      // and calculate direcation based on that

      let direction = actionRef.current.direction
      const speed = isUp ? 0 : 1
      switch (event.code) {
        case 'ArrowUp':
          direction = { ...direction, y: -speed }
          break
        case 'ArrowDown':
          direction = { ...direction, y: speed }
          break
        case 'ArrowLeft':
          direction = { ...direction, x: -speed }
          break
        case 'ArrowRight':
          direction = { ...direction, x: speed }
          break
      }
      console.log('new', direction)
      updateUserAction({ ...currentUserAction, direction: direction })
    }

    const upListener = keyListener(true)
    const downListener = keyListener(false)

    document.addEventListener('keydown', downListener)
    document.addEventListener('keyup', upListener)

    return () => {
      document.removeEventListener('keydown', downListener)
      document.removeEventListener('keyup', upListener)
    }
  }, [])

  useTick(() => {
    tick()
    // This is the hackiest part by far. Tick updates the state in game class,
    // but that does not trigger re-render, since it's not a state.
    // We can force the re-render with this function.
    forceUpdate()
  })

  return (
    <>
      <Tank
        tankState={gameState.rootTank}
        userAction={currentUserActions.rootAction}
      />
      <Tank
        tankState={gameState.nodeTank}
        userAction={currentUserActions.nodeAction}
      />
      <Wall coordinates={gameState.wallCoordinates} />
      <Text text={JSON.stringify(currentUserAction)} />
    </>
  )
}

export default TankGame
