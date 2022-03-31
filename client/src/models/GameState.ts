export interface UserAction {
  direction: Direction
  shooting: boolean
}

export interface Direction {
  x: number
  y: number
}

export interface TankState {
  pos: Coordinate
  dir: Direction
  color: number
}

export interface Coordinate {
  x: number
  y: number
}

export interface GameState {
  tankState: TankState
  wallCoordinates: Coordinate[]
}
