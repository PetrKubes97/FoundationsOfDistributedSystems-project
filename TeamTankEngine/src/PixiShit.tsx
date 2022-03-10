import { Container, Stage, Sprite, useTick } from '@inlet/react-pixi';
import React, { useRef, useState, KeyboardEvent } from "react";

interface Props {
  
  }

  
const Ninja = () => {
  const image = './src/tank.png';

  const width = 500;
  const height = 500;

  const [rotate, updateRotate] = useState(0);
  const [scale, updateScale] = useState(1);

  const iter = useRef(0);
  useTick(delta => {
    const i = (iter.current += 0.05 * delta)
    updateRotate((Math.cos(i) * width) / 100);
    updateScale(1 + Math.sin(i) * 0.5);
  })

  /*if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
    }
    else if (e.keyCode == '39') {
       // right arrow
    } */

    
    return (
   
        <Container
        rotation={rotate}
        pivot={50}
        position={[width / 2, height / 2]}
        scale={scale}
      >
          <Sprite anchor={0.5} image={image} width={50} height={50} x={0} y={0} />
          <Sprite anchor={0.5} image={image} width={50} height={50} x={50} y={50} />
          <Sprite anchor={0.5} image={image} width={50} height={50} x={100} y={100} />    
        </Container>
      
    );
};

export const PixiComp3: React.FC<Props> = ({}) => {  

  const [top, setTop] = useState(0);
  
  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "ArrowUp") {
   
    
    console.log(event.code);
    console.log('Wooho')
    setTop((top) => top+10);
    console.log(top)
    }
  };
  

  return (
    <>
    <Stage width={500} height={500} options={{ backgroundColor: 0x505152 }}>
      <Ninja/>
    </Stage>
    </>
  )
}

export default PixiComp3;