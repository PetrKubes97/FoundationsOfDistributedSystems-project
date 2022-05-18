import { FC, useCallback } from 'react'
import { Graphics } from '@inlet/react-pixi'
import { PROJECTILE_RADIUS } from '../../../config'

export const Projectile: FC<{ x: number; y: number }> = ({ x, y }) => {
  const draw = (g: any) => {
    g.clear()
    g.beginFill('black')
    g.drawCircle(x, y, PROJECTILE_RADIUS)
    g.endFill()
  }

  return <Graphics draw={draw} />
}
