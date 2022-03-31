import React from 'react'
import { Container, Sprite } from '@inlet/react-pixi'
import { Wall as WallType } from '../../../models/GameState'

interface Props {
  coordinates: WallType[]
}

export const Wall: React.FC<Props> = ({ coordinates }) => {
  const image = './src/images/wall.jpg'

  return (
    <Container>
      {coordinates &&
        coordinates.map((c) => (
          <Sprite
            x={c.x}
            y={c.y}
            anchor={0}
            image={image}
            width={c.size}
            height={c.size}
          />
        ))}
    </Container>
  )
}
