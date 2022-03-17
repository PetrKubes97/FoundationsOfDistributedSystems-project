export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  x: number;
  y: number;
}

export interface TankState {
  pos: Position;
  dir: Direction;
  color: number;
}

export interface GameState {
  tankStates: TankState[];
}
