import React from 'react'
import { Container, Sprite } from '@inlet/react-pixi'
import { Coordinate } from '../models/GameState'

interface Props {
  coordinates: Coordinate[] | undefined
}

export const Wall: React.FC<Props> = ({ coordinates }) => {
  const image = './src/images/wall.jpg'
  const wallWidth = 50
  const wallHeight = 50

  return (
    <Container>
      {coordinates &&
        coordinates.map((c) => (
          <Sprite
            x={c.x}
            y={c.y}
            anchor={0.5}
            image={image}
            width={wallWidth}
            height={wallHeight}
          />
        ))}
    </Container>
  )
}
