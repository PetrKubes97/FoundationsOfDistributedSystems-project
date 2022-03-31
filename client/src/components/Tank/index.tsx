import React, { useEffect, useState } from 'react';
import { Sprite, useTick } from '@inlet/react-pixi';
import {
  FIELD_HEIGHT,
  FIELD_WIDTH,
  TANK_HEIGHT,
  TANK_WIDTH,
} from '../../config';
import { checkCollision, determineRotation } from '../../helpers/tank';
import { Coordinate, TankState } from '../../models/GameState';
import TankImage from './tank.png';

interface Props {
  tankState: TankState | undefined;
  setTankState: (fn: (ts: TankState) => TankState) => void;
  wallCoordinate: Coordinate[] | undefined;
}

export const Tank: React.FC<Props> = ({
  tankState,
  setTankState,
  wallCoordinate: wallCoordinates,
}) => {
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    if (tankState) {
      setRotation((old) =>
        determineRotation(tankState.dir.x, tankState.dir.y, old)
      );
    }
  }, [tankState]);

  useTick(() => {
    if (tankState && wallCoordinates) {
      const oldPosX = tankState.pos.x;
      const oldPosY = tankState.pos.y;

      var newPositionX = Math.min(
        Math.max(0 + TANK_WIDTH / 2, tankState.pos.x + tankState.dir.x),
        FIELD_WIDTH - TANK_WIDTH / 2
      );
      var newPositionY = Math.min(
        Math.max(0 + TANK_HEIGHT / 2, tankState.pos.y + tankState.dir.y),
        FIELD_HEIGHT - TANK_HEIGHT / 2
      );

      for (let i = 0; i < wallCoordinates.length; i++) {
        if (
          checkCollision(
            // tankState.pos,
            { x: newPositionX, y: newPositionY },
            wallCoordinates[i]['x'],
            wallCoordinates[i]['y'],
            TANK_WIDTH,
            TANK_HEIGHT
          )
        ) {
          newPositionX = oldPosX;
          newPositionY = oldPosY;
        }
      }
      setTankState((old) => ({
        ...old,
        pos: { x: newPositionX, y: newPositionY },
      }));
    }
  });

  return (
    <>
      {tankState && (
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
      )}
    </>
  );
};

export default Tank;
