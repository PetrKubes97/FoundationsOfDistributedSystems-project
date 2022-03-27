import React, { useEffect, useState } from 'react';
import { Sprite, useTick } from '@inlet/react-pixi';
import {
  FIELD_HEIGHT,
  FIELD_WIDTH,
  TANK_HEIGHT,
  TANK_WIDTH,
} from '../../config';
import { checkCollision, determineRotation } from '../../helpers/tank';
import { TankState } from '../../models/GameState';
import { coordinates } from '../Wall';
import TankImage from './tank.png';

interface Props {
  tankState: TankState;
  setTankState: React.Dispatch<React.SetStateAction<TankState>>;
}

export const Tank: React.FC<Props> = ({ tankState, setTankState }) => {
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    setRotation((old) =>
      determineRotation(tankState.dir.x, tankState.dir.y, old)
    );
  }, [tankState]);

  useTick(() => {
    for (let i = 0; i < coordinates.length; i++) {
      if (
        !checkCollision(
          tankState.pos,
          coordinates[i]['x'],
          coordinates[i]['y'],
          TANK_WIDTH,
          TANK_HEIGHT
        )
      ) {
        const newPositionX = Math.min(
          Math.max(TANK_WIDTH / 2, tankState.pos.x + tankState.dir.x),
          FIELD_WIDTH - TANK_WIDTH / 2
        );
        const newPositionY = Math.min(
          Math.max(TANK_HEIGHT / 2, tankState.pos.y + tankState.dir.y),
          FIELD_HEIGHT - TANK_HEIGHT / 2
        );

        setTankState((old) => ({
          ...old,
          pos: { x: newPositionX, y: newPositionY },
        }));
      }
    }
  });

  return (
    <>
      <Sprite
        x={tankState.pos.x}
        y={tankState.pos.y}
        anchor={0.5}
        image={TankImage}
        tint={tankState.color}
        width={TANK_WIDTH}
        height={TANK_HEIGHT}
        rotation={(rotation * Math.PI) / 180}
      />
    </>
  );
};

export default Tank;
