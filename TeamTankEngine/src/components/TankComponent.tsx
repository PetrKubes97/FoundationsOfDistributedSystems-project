import { Sprite } from '@inlet/react-pixi';

import React from 'react';

interface Props {
  position: {
    x: number;
    y: number;
  };
  direction: {
    x: number;
    y: number;
  };
  tankWidth: number;
  tankHeight: number;
  image: string;
}

let lastRotation = 0;
export const Tank: React.FC<Props> = (props) => {
  const { direction, position, tankWidth, tankHeight, image } = props;

  let rotation = 0;

  if (direction.y == 0 && direction.x == 1) {
    rotation = 0;
  } else if (direction.y == 1 && direction.x == 1) {
    rotation = 45;
  } else if (direction.y == 1 && direction.x == 0) {
    rotation = 90;
  } else if (direction.y == 1 && direction.x == -1) {
    rotation = 135;
  } else if (direction.y == 0 && direction.x == -1) {
    rotation = 180;
  } else if (direction.y == -1 && direction.x == -1) {
    rotation = 225;
  } else if (direction.y == -1 && direction.x == 0) {
    rotation = 270;
  } else if (direction.y == -1 && direction.x == 1) {
    rotation = 315;
  } else if (direction.y == 0 && direction.x == 0) {
    rotation = lastRotation;
  }
  lastRotation = rotation;

  return (
    <>
      <Sprite
        x={position.x}
        y={position.y}
        anchor={0.5}
        image={image}
        width={tankWidth}
        height={tankHeight}
        rotation={(rotation * Math.PI) / 180}
      />
    </>
  );
};

export default Tank;
