import React, { useEffect, useRef, useState } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'

import TankImage from '../tank.png'
import {
  FIELD_HEIGHT,
  FIELD_WIDTH,
  TANK_HEIGHT,
  TANK_WIDTH,
} from '../../../config'
import { TankState, UserAction } from '../game-logic/Game'
import { determineRotation } from '../gameHelpers'

interface Props {
  tankState: TankState
  userAction: UserAction
}

export const Tank: React.FC<Props> = ({ tankState, userAction }) => {
  const ref = useRef(0)

  const rotation = determineRotation(
    userAction.direction.x,
    userAction.direction.y,
    ref.current
  )
  ref.current = rotation

  return (
    <>
      {tankState && (
        <Sprite
          x={tankState.pos.x}
          y={tankState.pos.y}
          anchor={0.5}
          image={TankImage}
          tint={tankState.color}
          width={TANK_WIDTH}
          height={TANK_HEIGHT}
          rotation={(rotation * Math.PI) / 180}
        />
      )}
    </>
  )
}

export default Tank
