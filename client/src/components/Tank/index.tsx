import { Sprite } from '@inlet/react-pixi';

import React, { useEffect, useState } from 'react';
import { TankState } from '../../models/GameState';
import TankImage from './tank.png';

interface Props {
  tankState: TankState;
  tankWidth: number;
  tankHeight: number;
}

const determineRotation = (
  x: number,
  y: number,
  lastRotation: number
): number => {
  switch (x + '|' + y) {
    case '1|0':
      return 0;
    case '1|1':
      return 45;
    case '0|1':
      return 90;
    case '-1|1':
      return 135;
    case '-1|0':
      return 180;
    case '-1|-1':
      return 225;
    case '0|-1':
      return 270;
    case '1|-1':
      return 315;
    case '0|0':
    default:
      return lastRotation;
  }
};

export const Tank: React.FC<Props> = ({ tankState, tankWidth, tankHeight }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setRotation((old) =>
      determineRotation(tankState.dir.x, tankState.dir.y, old)
    );
  }, [tankState]);

  return (
    <>
      <Sprite
        x={tankState.pos.x}
        y={tankState.pos.y}
        anchor={0.5}
        image={TankImage}
        tint={tankState.color}
        width={tankWidth}
        height={tankHeight}
        rotation={(rotation * Math.PI) / 180}
      />
    </>
  );
};

export default Tank;
