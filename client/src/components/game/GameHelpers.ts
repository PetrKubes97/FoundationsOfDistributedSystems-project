import { Coordinate, Wall } from '../../models/GameState'
import { FIELD_WIDTH } from '../../config'

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

export {}
