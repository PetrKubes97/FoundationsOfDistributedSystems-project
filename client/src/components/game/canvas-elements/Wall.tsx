import React from 'react'
import { Container, Sprite } from '@inlet/react-pixi'
import { Wall as WallType } from '../game-logic/Game'
import WallImage from './src/images/wall.jpg'

interface Props {
  coordinates: WallType[]
}

export const Wall: React.FC<Props> = ({ coordinates }) => {
  return (
    <Container>
      {coordinates &&
        coordinates.map((c) => (
          <Sprite
            x={c.x}
            y={c.y}
            anchor={0}
            image={WallImage}
            width={c.size}
            height={c.size}
          />
        ))}
    </Container>
  )
}
