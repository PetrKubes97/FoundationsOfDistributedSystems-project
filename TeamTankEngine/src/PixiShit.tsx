import { Container, Stage, Sprite, useTick } from '@inlet/react-pixi';
import React, { useRef, useState, KeyboardEvent, useEffect } from "react";

interface Props {

}


let lastRotation = 0
const Ninja = () => {
  const image = './src/tank.png';

  const tankWidth = 50;
  const tankHeight = 50;


  const width = 500;
  const height = 500;

  const [rotate, updateRotate] = useState(0);
  const [scale, updateScale] = useState(1);

  const [position, setPosition] = useState({x: 0, y: 0});

  const iter = useRef(0);

  useTick(delta => {
    //const i = (iter.current += 0.05 * delta)
    //updateRotate((Math.cos(i) * width) / 100);
    //updateScale(1 + Math.sin(i) * 0.5);
    
    const newPositionX = Math.min(Math.max(0+tankWidth/2, position.x + direction.x), width-tankWidth/2)
    const newPositionY = Math.min(Math.max(0+tankHeight/2, position.y + direction.y), height-tankHeight/2)

    setPosition({x: newPositionX, y: newPositionY});
    console.log(direction)
  

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
      <Stage width={500} height={500} options={{ backgroundColor: 0x505152 }}>
        <Ninja />
      </Stage>
    </>
  )
}

export default PixiComp3;