import { checkCollision, map, mapToCoordinates } from '../gameHelpers'
import {
  FIELD_HEIGHT,
  FIELD_WIDTH,
  PROJECTILE_RADIUS,
  TANK_HEIGHT,
  TANK_WIDTH,
} from '../../../config'
import { Engine, Rotate } from './enums'

const rotateToNumber = (rotate: Rotate) => {
  switch (rotate) {
    case Rotate.ANTI_CLOCKWISE:
      return -1.0
    case Rotate.CLOCKWISE:
      return 1.0
    case Rotate.NO_ROTATION:
      return 0.0
  }

  return 0.0
}

export type UserAction = {
  engine: Engine
  rotate: Rotate
  shooting: boolean
}

export type TankState = {
  pos: Vector
  rotation: number
  color: number
  lastShot: Date
}

export type Vector = {
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

export type Projectile = {
  position: Vector
  direction: Vector
}

// User actions are actually part of the game state, since they determine the
// tanks orientation
export type GameState = {
  rootTank: TankState
  nodeTank: TankState
  wallCoordinates: Wall[]
  userActions: UserActions
  projectiles: Projectile[]
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
        rotation: 0,
        color: 0x808000,
        lastShot: new Date(),
      },
      rootTank: {
        pos: {
          x: FIELD_WIDTH,
          y: 0,
        },
        rotation: Math.PI,
        color: 0xa9513f,
        lastShot: new Date(),
      },
      wallCoordinates: mapToCoordinates(map),
      userActions: {
        nodeAction: {
          engine: Engine.NO_MOVEMENT,
          rotate: Rotate.NO_ROTATION,
          shooting: false,
        },
        rootAction: {
          engine: Engine.NO_MOVEMENT,
          rotate: Rotate.NO_ROTATION,
          shooting: false,
        },
      },
      projectiles: [],
    }
  }

  update() {
    const wallCoordinates = this.gameState.wallCoordinates

    const calculateClampedPosition = (
      direction: Vector,
      position: Vector
    ): Vector => {
      let newPositionX = Math.min(
        Math.max(TANK_WIDTH / 2, position.x + direction.x),
        FIELD_WIDTH - TANK_WIDTH / 2
      )
      let newPositionY = Math.min(
        Math.max(TANK_HEIGHT / 2, position.y + direction.y),
        FIELD_HEIGHT - TANK_HEIGHT / 2
      )

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

    const PROJECTILE_SPEED = 5
    for (let i = 0; i < this.gameState.projectiles.length; i++) {
      const direction = this.gameState.projectiles[i].direction
      const position = this.gameState.projectiles[i].position
      position.x += direction.x * PROJECTILE_SPEED
      position.y += direction.y * PROJECTILE_SPEED

      for (const wallCoordinate of wallCoordinates) {
        if (
          checkCollision(position, PROJECTILE_RADIUS * 2, {
            x: wallCoordinate.x + wallCoordinate.size / 2,
            y: wallCoordinate.y + wallCoordinate.size / 2,
            size: wallCoordinate.size,
          })
        ) {
          this.gameState.projectiles[i].direction = { x: 0, y: 0 }
        }
      }
    }

    const addProjectile = (tank: TankState) => {
      tank.lastShot = new Date()
      this.gameState.projectiles.push({
        position: {
          x: tank.pos.x,
          y: tank.pos.y,
        },
        direction: {
          x: Math.cos(tank.rotation),
          y: Math.sin(tank.rotation),
        },
      })
    }

    const nodeAction = this.gameState.userActions.nodeAction
    const nodeTank = this.gameState.nodeTank
    const rootAction = this.gameState.userActions.rootAction
    const rootTank = this.gameState.rootTank

    const RELOAD_TIME = 0.5
    const shouldShoot = (tank: TankState, action: UserAction) => {
      return (
        action.shooting &&
        new Date().getTime() - tank.lastShot.getTime() > RELOAD_TIME * 1000
      )
    }

    if (shouldShoot(rootTank, rootAction)) {
      addProjectile(rootTank)
    }

    if (shouldShoot(nodeTank, nodeAction)) {
      addProjectile(nodeTank)
    }

    const rotationToDirection = (engine: Engine, rotation: number): Vector => {
      if (engine == Engine.NO_MOVEMENT) return { x: 0, y: 0 }
      const directionMultiplier = engine == Engine.FORWARD ? 1 : -1

      return {
        x: Math.cos(rotation) * directionMultiplier,
        y: Math.sin(rotation) * directionMultiplier,
      }
    }

    const ROTATION_SPEED = 0.03
    this.gameState.rootTank.rotation +=
      rotateToNumber(this.gameState.userActions.rootAction.rotate) *
      ROTATION_SPEED
    this.gameState.nodeTank.rotation +=
      rotateToNumber(this.gameState.userActions.nodeAction.rotate) *
      ROTATION_SPEED

    this.gameState.rootTank.pos = calculateClampedPosition(
      rotationToDirection(
        this.gameState.userActions.rootAction.engine,
        this.gameState.rootTank.rotation
      ),
      this.gameState.rootTank.pos
    )

    this.gameState.nodeTank.pos = calculateClampedPosition(
      rotationToDirection(
        this.gameState.userActions.nodeAction.engine,
        this.gameState.nodeTank.rotation
      ),
      this.gameState.nodeTank.pos
    )
  }
}
