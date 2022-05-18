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

interface Props {
  tankState: TankState
}

export const Tank: React.FC<Props> = ({ tankState }) => {
  return (
    <Sprite
      x={tankState.pos.x}
      y={tankState.pos.y}
      anchor={0.5}
      image={TankImage}
      tint={tankState.color}
      width={TANK_WIDTH}
      height={TANK_HEIGHT}
      rotation={tankState.rotation}
    />
  )
}

export default Tank
