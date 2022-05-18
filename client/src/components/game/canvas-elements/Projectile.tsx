import { FC, useCallback } from 'react'
import { Graphics } from '@inlet/react-pixi'

export const Projectile: FC<{ x: number; y: number }> = ({ x, y }) => {
  const draw = (g: any) => {
    g.clear()
    g.beginFill('black')
    g.drawCircle(x, y, 5)
    g.endFill()
  }

  return <Graphics draw={draw} />
}
