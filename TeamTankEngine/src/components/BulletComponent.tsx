import { useTick } from '@inlet/react-pixi';
import { Sprite } from '@inlet/react-pixi';

import React, { useState }  from 'react';

interface Props {
  startPosition: {
    x: number;
    y: number;
  };
  direction: {
    x: number;
    y: number;
  };
  bulletSize: number;
  canvasHeight: number;
  canvasWidth: number;
}

export const Bullet: React.FC<Props> = (props) => {
  const image = './src/images/bullet.png'
  const { direction, startPosition, bulletSize, canvasHeight, canvasWidth } = props;

  const [position, setPosition] = useState(startPosition);

  useTick(() => {
    var newPositionX = Math.min(
      Math.max(0 + bulletSize / 2, position.x + direction.x),
      canvasWidth - bulletSize / 2
    );
    var newPositionY = Math.min(
      Math.max(0 + bulletSize / 2, position.y + direction.y),
      canvasHeight - bulletSize / 2
    );

    setPosition({ x: newPositionX, y: newPositionY });
  });

  return (
    <>
      <Sprite
        x={position.x}
        y={position.y}
        anchor={0.5}
        image={image}
        width={bulletSize}
        height={bulletSize}
        //rotation={(rotation * Math.PI) / 180}
      />
    </>
  );
};

export default Bullet;
