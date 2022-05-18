import { FIELD_WIDTH } from '../../config'
import { UserAction, Vector, Wall } from './game-logic/Game'
import { Key } from './providers/KeyControlsProvider'
import { Engine, Rotate } from './game-logic/enums'

export const map: number[][] = [
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
]

// TODO: This assumes both map and canvas being square
export const mapToCoordinates = (map: number[][]): Wall[] => {
  const wallSize = FIELD_WIDTH / map.length
  const offset = 0

  const result: Wall[] = []
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (!map[y][x]) continue

      result.push({
        x: x * wallSize + offset,
        y: y * wallSize + offset,
        size: wallSize,
      })
    }
  }
  return result
}

export const determineRotation = (
  x: number,
  y: number,
  lastRotation: number
): number => {
  // This feels stupid 😅
  switch (Math.round(x) + '|' + Math.round(y)) {
    case '1|0':
      return 0
    case '1|1':
      return 45
    case '0|1':
      return 90
    case '-1|1':
      return 135
    case '-1|0':
      return 180
    case '-1|-1':
      return 225
    case '0|-1':
      return 270
    case '1|-1':
      return 315
    case '0|0':
    default:
      return lastRotation
  }
}

export const checkCollision = (
  tankPos: Vector,
  tankSize: number,
  wallPos: Wall
) => {
  const halfTankSize = tankSize / 2
  const halfWallSize = wallPos.size / 2

  return (
    tankPos.x + halfTankSize > wallPos.x - halfWallSize &&
    tankPos.x - halfTankSize < wallPos.x + halfWallSize &&
    tankPos.y + halfTankSize > wallPos.y - halfWallSize &&
    tankPos.y - halfTankSize < wallPos.y + halfWallSize
  )
}

const keyToRotationMapping = {
  [Key.right]: Rotate.CLOCKWISE,
  [Key.left]: Rotate.ANTI_CLOCKWISE,
}

const keyToEngine = {
  [Key.up]: Engine.FORWARD,
  [Key.down]: Engine.BACKWARD,
}

export const keysToAction = (keys: Key[]): UserAction => {
  let rotate: Rotate = Rotate.NO_ROTATION
  for (const key of keys) {
    if (key == Key.left || key == Key.right) {
      rotate = keyToRotationMapping[key]
      break
    }
  }

  let engine: Engine = Engine.NO_MOVEMENT
  for (const key of keys) {
    if (key == Key.up || key == Key.down) {
      engine = keyToEngine[key]
      break
    }
  }

  const shooting = !!keys.find((key) => key === Key.space)

  return {
    rotate,
    engine,
    shooting,
  }
}

export {}
