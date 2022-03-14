import { Stage, Sprite, useTick } from '@inlet/react-pixi';
import React, { useState, useEffect } from "react";

interface Props {

}

let width = 500;
let height = 500;

let lastRotation = 0

const Tank = () => {
  const image = './src/tank.png';

  const tankWidth = 50;
  const tankHeight = 50;

  const [position, setPosition] = useState({x: 0, y: 0});

  useTick(() => {
    const newPositionX = Math.min(Math.max(0+tankWidth/2, position.x + direction.x), width-tankWidth/2)
    const newPositionY = Math.min(Math.max(0+tankHeight/2, position.y + direction.y), height-tankHeight/2)

    setPosition({x: newPositionX, y: newPositionY});
  })

  const [direction, setDirection] = useState({ x: 0, y: 0 });

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



  let rotation = 0
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
    rotation = lastRotation
  }
  lastRotation = rotation
  
  return (
    <Sprite x={position.x} y={position.y} anchor={0.5} image={image} width={tankWidth} height={tankHeight} rotation={rotation*Math.PI/180}/>
  );
};

export const PixiComp3: React.FC<Props> = ({ }) => {

  return (
    <>
      <Stage width={width} height={height} options={{ backgroundColor: 0x505152 }}>
        <Tank/>
      </Stage>
    </>
  )
}

export default PixiComp3;