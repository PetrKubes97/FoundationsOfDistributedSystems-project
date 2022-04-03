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

export type GameState = {
  rootTank: TankState
  nodeTank: TankState
  wallCoordinates: Wall[]
}

export type UserActions = {
  rootAction: UserAction
  nodeAction: UserAction
}

export class Game {
  gameState: GameState
  userActions: UserActions

  constructor() {
    this.gameState = {
      nodeTank: {
        pos: {
          x: 0,
          y: 0,
        },
        color: 0xffffff,
      },
      rootTank: {
        pos: {
          x: 100,
          y: 100,
        },
        color: 0xffffff * 0.5,
      },
      wallCoordinates: mapToCoordinates(map),
    }
    console.log('here')
    this.userActions = {
      nodeAction: { direction: { x: 0, y: 0 }, shooting: false },
      rootAction: { direction: { x: 0, y: 0 }, shooting: false },
    }
  }

  update() {
    // TODO apply action to state, including checking for walls etc. Could be done by copying
    // the state or updating it directly

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

    // console.log('inClass:', this)
    // console.log('inClass:', this.userActions)
    // console.log('inClass:', this.userActions.nodeAction)
    // console.log('inClass:', this.userActions.nodeAction.direction)

    this.gameState.rootTank.pos = calculateClampedPosition(
      this.gameState.rootTank.pos,
      this.userActions.rootAction.direction
    )

    this.gameState.nodeTank.pos = calculateClampedPosition(
      this.gameState.nodeTank.pos,
      this.userActions.nodeAction.direction
    )

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
