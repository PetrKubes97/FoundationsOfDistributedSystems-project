import { FIELD_WIDTH } from '../../config'
import { Coordinate, Wall } from './game-logic/Game'

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

export {}
