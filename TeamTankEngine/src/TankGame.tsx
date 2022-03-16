import { Stage, Sprite, useTick } from '@inlet/react-pixi';
import React, { useState, useEffect } from "react";
import { Tank } from './Tank';

interface Props {

}

let width = 500;
let height = 500;

let tankWidth = 50;
let tankHeight = 50;

const MyTank = () => {
  const myTankImage = './src/tank.png';

  const [position, setPosition] = useState({x: 0, y: 0});
  const [direction, setDirection] = useState({ x: 0, y: 0 });

  useTick(() => {
    const newPositionX = Math.min(Math.max(0+tankWidth/2, position.x + direction.x), width-tankWidth/2)
    const newPositionY = Math.min(Math.max(0+tankHeight/2, position.y + direction.y), height-tankHeight/2)

    setPosition({x: newPositionX, y: newPositionY});
  })

  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      event.preventDefault();
    
      switch (event.code) {
        case "ArrowUp":
          setDirection(direction => ({ ...direction, y: -1 }));
          break;
        case "ArrowDown":
          setDirection(direction => ({ ...direction, y: 1 }));
          break;
        case "ArrowLeft":
          setDirection(direction => ({ ...direction, x: -1 }));
          break;
        case "ArrowRight":
          setDirection(direction => ({ ...direction, x: 1 }));
          break;
      }
    })

    document.addEventListener('keyup', function (event) {
      switch (event.code) {
        case "ArrowLeft":
        case "ArrowDown":
        case "ArrowRight":
        case "ArrowUp":
          setDirection({ x: 0, y: 0 });
          break;
      }
    })
  }, []);

  return (
    <Tank position={position} direction={direction} tankWidth={tankWidth} tankHeight={tankHeight} image={myTankImage}/>
  );
};

const OpponentTank = () => {
  const opponentTankImage = './src/OpponentTank.png';

  const position = {
    x: 250,
    y: 250
  }
  const direction = {
    x: 0,
    y: 0
  }

  return (
    <Tank position={position} direction={direction} tankWidth={tankWidth} tankHeight={tankHeight} image={opponentTankImage}/>
  );

}

export const TankGame: React.FC<Props> = ({ }) => {

  return (
    <>
      <Stage width={width} height={height} options={{ backgroundColor: 0x505152 }}>
        <MyTank/>
        <OpponentTank/>
      </Stage>
    </>
  )
}

export default TankGame;