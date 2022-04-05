import { FIELD_WIDTH } from '../../config'
import { Coordinate, Direction, UserAction, Wall } from './game-logic/Game'
import { Key } from './providers/KeyControlsProvider'

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
  switch (x + '|' + y) {
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
  pos: Coordinate,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  return pos.x > x - w && pos.x < x + w && pos.y > y - h && pos.y < y + h
}

const keyToDirMapping = {
  [Key.up]: { x: 0, y: -1 },
  [Key.down]: { x: 0, y: 1 },
  [Key.left]: { x: -1, y: 0 },
  [Key.right]: { x: 1, y: 0 },
}
const keyToDirections = (
  lastPressed: Key,
  secondLastPressed: Key | undefined
): Direction => {
  if (secondLastPressed === undefined) {
    return keyToDirMapping[lastPressed]
  }

  const dir1 = keyToDirMapping[lastPressed]
  const dir2 = keyToDirMapping[secondLastPressed]

  // I'm genius 🤪
  return {
    x: dir1.x + dir2.x,
    y: dir1.y + dir2.y,
  }
}

export const keysToAction = (keys: Key[]): UserAction => {
  let newAction: UserAction = {
    direction: { x: 0, y: 0 },
    shooting: false,
  }

  if (keys.length >= 1) {
    const lastPressedKey = keys[keys.length - 1]
    let secondLastPressedKey: Key | undefined = undefined
    if (keys.length >= 2) {
      secondLastPressedKey = keys[keys.length - 2]
    }

    newAction = {
      direction: keyToDirections(lastPressedKey, secondLastPressedKey),
      shooting: false,
    }
  }

  return newAction
}

export {}
