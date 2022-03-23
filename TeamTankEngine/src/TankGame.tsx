import { Stage, useTick } from '@inlet/react-pixi';
import React, { useState, useEffect } from 'react';
import { Tank } from './components/TankComponent';
import { coordinates, WallComponent } from './components/WallComponent';
import { Bullet } from './components/BulletComponent';

interface Props {}

let width = 700;
let height = 700;

let tankWidth = 50;
let tankHeight = 50;

const fireBullet = (position: {x: number, y: number}, direction: {x: number, y: number}) => {
  return (<Bullet startPosition={position} 
    direction={{x: 2,y:2}}
    bulletSize={12}
    canvasHeight={height}
    canvasWidth={width}/> )

}

const MyTank = () => {
  const myTankImage = './src/images/tank.png';

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [oldPos, setOldPos] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });

  const [bulletFired, setBulletFired] = useState(false);

  useTick(() => {
    var newPositionX = Math.min(
      Math.max(0 + tankWidth / 2, position.x + direction.x),
      width - tankWidth / 2
    );
    var newPositionY = Math.min(
      Math.max(0 + tankHeight / 2, position.y + direction.y),
      height - tankHeight / 2
    );

    function checkCollision(x: number, y: number, w: number, h: number) {
      if (
        position.x > x - w &&
        position.x < x + w &&
        position.y > y - h &&
        position.y < y + h
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

    setOldPos({ x: position.x, y: position.y });
    setPosition({ x: newPositionX, y: newPositionY });
  });

  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      event.preventDefault();

      switch (event.code) {
        case 'ArrowUp':
          setDirection((direction) => ({ ...direction, y: -1 }));
          break;
        case 'ArrowDown':
          setDirection((direction) => ({ ...direction, y: 1 }));
          break;
        case 'ArrowLeft':
          setDirection((direction) => ({ ...direction, x: -1 }));
          break;
        case 'ArrowRight':
          setDirection((direction) => ({ ...direction, x: 1 }));
          break;
        case 'Space':
          setBulletFired(true);
          break;  
      }
    });

    document.addEventListener('keyup', function (event) {

      switch (event.code) {
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowRight':
        case 'ArrowUp':
          setDirection({ x: 0, y: 0 });
          break;
      }
    });
  }, []);

  return (
    <>
      <Tank
        position={position}
        direction={direction}
        tankWidth={tankWidth}
        tankHeight={tankHeight}
        image={myTankImage}
      />
      {bulletFired ? fireBullet(position, direction) : null }
    </>
  );
};

const OpponentTank = () => {
  const opponentTankImage = './src/images/OpponentTank.png';

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
      position={position}
      direction={direction}
      tankWidth={tankWidth}
      tankHeight={tankHeight}
      image={opponentTankImage}
    />
  );
};

export const TankGame: React.FC<Props> = ({}) => {
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
