import { useTick } from '@inlet/react-pixi'
import { useEffect, useState } from 'react'
import Tank from './index'
import { TankState } from '../../../models/GameState'
import { coordinates } from '../Wall'

const width = 700
const height = 700

const tankWidth = 50
const tankHeight = 50

export const MyTank: React.FC = () => {
  const [tankState, setTankState] = useState<TankState>({
    pos: { x: 0, y: 0 },
    dir: { x: 0, y: 0 },
    color: 0x00ff00,
  })
  const [oldPos, setOldPos] = useState({ x: 0, y: 0 })

  useTick(() => {
    var newPositionX = Math.min(
      Math.max(0 + tankWidth / 2, tankState.pos.x + tankState.dir.x),
      width - tankWidth / 2
    )
    var newPositionY = Math.min(
      Math.max(0 + tankHeight / 2, tankState.pos.y + tankState.dir.y),
      height - tankHeight / 2
    )

    function checkCollision(x: number, y: number, w: number, h: number) {
      if (
        tankState.pos.x > x - w &&
        tankState.pos.x < x + w &&
        tankState.pos.y > y - h &&
        tankState.pos.y < y + h
      ) {
        return true
      }
      return false
    }

    for (let i = 0; i < coordinates.length; i++) {
      if (checkCollision(coordinates[i]['x'], coordinates[i]['y'], 50, 50)) {
        newPositionX = oldPos.x
        newPositionY = oldPos.y
      }
    }

    setOldPos({ x: tankState.pos.x, y: tankState.pos.y })
    setTankState((old) => ({
      ...old,
      pos: { x: newPositionX, y: newPositionY },
    }))
  })

  return <Tank tankState={tankState} />
}

export const OpponentTank = () => {
  const position = {
    x: 400,
    y: 400,
  }

  const direction = {
    x: 0,
    y: 0,
  }

  return <Tank tankState={{ pos: position, dir: direction, color: 0xff0000 }} />
}
