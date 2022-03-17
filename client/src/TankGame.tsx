import { Stage, useTick } from '@inlet/react-pixi';
import React, { useState, useEffect } from 'react';
import { Tank } from './components/Tank';
import { coordinates, WallComponent } from './components/Wall';
import { GameState, TankState } from './models/GameState';

interface Props {}

let width = 700;
let height = 700;

let tankWidth = 50;
let tankHeight = 50;

const MyTank: React.FC = () => {
  const [tankState, setTankState] = useState<TankState>({
    pos: { x: 0, y: 0 },
    dir: { x: 0, y: 0 },
    color: 0x00ff00,
  });
  const [oldPos, setOldPos] = useState({ x: 0, y: 0 });

  useTick(() => {
    var newPositionX = Math.min(
      Math.max(0 + tankWidth / 2, tankState.pos.x + tankState.dir.x),
      width - tankWidth / 2
    );
    var newPositionY = Math.min(
      Math.max(0 + tankHeight / 2, tankState.pos.y + tankState.dir.y),
      height - tankHeight / 2
    );

    function checkCollision(x: number, y: number, w: number, h: number) {
      if (
        tankState.pos.x > x - w &&
        tankState.pos.x < x + w &&
        tankState.pos.y > y - h &&
        tankState.pos.y < y + h
      ) {
        return true;
      }
      return false;
    }

    for (let i = 0; i < coordinates.length; i++) {
      if (checkCollision(coordinates[i]['x'], coordinates[i]['y'], 50, 50)) {
        newPositionX = oldPos.x;
        newPositionY = oldPos.y;
      }
    }

    setOldPos({ x: tankState.pos.x, y: tankState.pos.y });
    setTankState((old) => ({
      ...old,
      pos: { x: newPositionX, y: newPositionY },
    }));
  });

  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      event.preventDefault();

      switch (event.code) {
        case 'ArrowUp':
          setTankState((old) => ({ ...old, dir: { ...old.dir, y: -1 } }));
          break;
        case 'ArrowDown':
          setTankState((old) => ({ ...old, dir: { ...old.dir, y: 1 } }));
          break;
        case 'ArrowLeft':
          setTankState((old) => ({ ...old, dir: { ...old.dir, x: -1 } }));
          break;
        case 'ArrowRight':
          setTankState((old) => ({ ...old, dir: { ...old.dir, x: 1 } }));
          break;
      }
    });

    document.addEventListener('keyup', function (event) {
      switch (event.code) {
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowRight':
        case 'ArrowUp':
          setTankState((old) => ({ ...old, dir: { x: 0, y: 0 } }));
          break;
      }
    });
  }, []);

  return (
    <Tank tankState={tankState} tankWidth={tankWidth} tankHeight={tankHeight} />
  );
};

const OpponentTank = () => {
  const position = {
    x: 400,
    y: 400,
  };

  const direction = {
    x: 0,
    y: 0,
  };

  return (
    <Tank
      tankState={{ pos: position, dir: direction, color: 0xff0000 }}
      tankWidth={tankWidth}
      tankHeight={tankHeight}
    />
  );
};

export const TankGame: React.FC<Props> = ({}) => {
  const [gameState, setGameState] = useState<GameState>();

  return (
    <>
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x505152 }}
      >
        <MyTank />
        <OpponentTank />
        <WallComponent />
      </Stage>
    </>
  );
};

export default TankGame;
