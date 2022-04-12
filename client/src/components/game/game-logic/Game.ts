import { map, mapToCoordinates } from '../gameHelpers'
import {
  FIELD_HEIGHT,
  FIELD_WIDTH,
  TANK_HEIGHT,
  TANK_WIDTH,
} from '../../../config'
import tankGame from '../TankGame'

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
    // TODO apply action to state, including checking for walls etc. Could be done by copying
    // the state or updating it directly
    // console.log('updating', this.gameState)

    const calculateClampedPosition = (
      direction: Direction,
      position: Coordinate
    ): Coordinate => {
      // TODO wall checking here

      const newPositionX = Math.min(
        Math.max(TANK_WIDTH / 2, position.x + direction.x),
        FIELD_WIDTH - TANK_WIDTH / 2
      )
      const newPositionY = Math.min(
        Math.max(TANK_HEIGHT / 2, position.y + direction.y),
        FIELD_HEIGHT - TANK_HEIGHT / 2
      )

      return {
        x: newPositionX,
        y: newPositionY,
      }
    }

    this.gameState.rootTank.pos = calculateClampedPosition(
      this.gameState.rootTank.pos,
      this.gameState.userActions.rootAction.direction
    )

    this.gameState.nodeTank.pos = calculateClampedPosition(
      this.gameState.nodeTank.pos,
      this.gameState.userActions.nodeAction.direction
    )

    // console.log('done', this.gameState)

    // if (tankState) {
    //   const oldPosX = tankState.pos.x
    //   const oldPosY = tankState.pos.y
    //
    //   let newPositionX = Math.min(
    //     Math.max(TANK_WIDTH / 2, tankState.pos.x + tankState.dir.x),
    //     FIELD_WIDTH - TANK_WIDTH / 2
    //   )
    //   let newPositionY = Math.min(
    //     Math.max(0 + TANK_HEIGHT / 2, tankState.pos.y + tankState.dir.y),
    //     FIELD_HEIGHT - TANK_HEIGHT / 2
    //   )
    //
    //   for (let i = 0; i < wallCoordinates.length; i++) {
    //     if (
    //       checkCollision(
    //         // tankState.pos,
    //         { x: newPositionX, y: newPositionY },
    //         wallCoordinates[i]['x'],
    //         wallCoordinates[i]['y'],
    //         TANK_WIDTH,
    //         TANK_HEIGHT
    //       )
    //     ) {
    //       newPositionX = oldPosX
    //       newPositionY = oldPosY
    //     }
    //   }
    //   setTankState((old) => ({
    //     ...old,
    //     pos: { x: newPositionX, y: newPositionY },
    //   }))
    // }
  }
}
