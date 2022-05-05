import { checkCollision, map, mapToCoordinates } from '../gameHelpers'
import {
  FIELD_HEIGHT,
  FIELD_WIDTH,
  TANK_HEIGHT,
  TANK_WIDTH,
} from '../../../config'
import tankGame from '../TankGame'
import { Wall } from '../canvas-elements/Wall'

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

export type UserActions = {
  rootAction: UserAction
  nodeAction: UserAction
}

// User actions are actually part of the game state, since they determine the
// tanks orientation
export type GameState = {
  rootTank: TankState
  nodeTank: TankState
  wallCoordinates: Wall[]
  userActions: UserActions
}

export class Game {
  gameState: GameState

  constructor() {
    this.gameState = {
      nodeTank: {
        pos: {
          x: 0,
          y: 0,
        },
        color: 0x808000,
      },
      rootTank: {
        pos: {
          x: FIELD_WIDTH,
          y: 0,
        },
        color: 0xa9513f,
      },
      wallCoordinates: mapToCoordinates(map),
      userActions: {
        nodeAction: { direction: { x: 0, y: 0 }, shooting: false },
        rootAction: { direction: { x: 0, y: 0 }, shooting: false },
      },
    }
  }

  update() {
    const calculateClampedPosition = (
      direction: Direction,
      position: Coordinate
    ): Coordinate => {
      let newPositionX = Math.min(
        Math.max(TANK_WIDTH / 2, position.x + direction.x),
        FIELD_WIDTH - TANK_WIDTH / 2
      )
      let newPositionY = Math.min(
        Math.max(TANK_HEIGHT / 2, position.y + direction.y),
        FIELD_HEIGHT - TANK_HEIGHT / 2
      )

      const wallCoordinates = this.gameState.wallCoordinates
      for (const wallCoordinate of wallCoordinates) {
        if (
          checkCollision({ x: newPositionX, y: newPositionY }, TANK_HEIGHT, {
            // Very ugly, walls use origin in corner, tank in the center
            x: wallCoordinate.x + wallCoordinate.size / 2,
            y: wallCoordinate.y + wallCoordinate.size / 2,
            size: wallCoordinate.size,
          })
        ) {
          newPositionX = position.x
          newPositionY = position.y
        }
      }

      return {
        x: newPositionX,
        y: newPositionY,
      }
    }

    this.gameState.rootTank.pos = calculateClampedPosition(
      this.gameState.userActions.rootAction.direction,
      this.gameState.rootTank.pos
    )

    this.gameState.nodeTank.pos = calculateClampedPosition(
      this.gameState.userActions.nodeAction.direction,
      this.gameState.nodeTank.pos
    )
  }
}
