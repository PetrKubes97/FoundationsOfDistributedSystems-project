export type UserAction = {
  direction: Direction
  shooting: boolean
}

export type Direction = {
  x: number
  y: number
}

export type TankState = {
  pos: Coordinate
  dir: Direction
  color: number
}

export type Coordinate = {
  x: number
  y: number
}

export type Wall = {
  x: number
  y: number
  size: number
}

export type GameState = {
  tanks: [TankState]
  wallCoordinates: Wall[]
}
