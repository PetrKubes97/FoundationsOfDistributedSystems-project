import { Container, Stage, Sprite, useTick } from '@inlet/react-pixi';
import React, { useRef, useState } from "react";

import { PixiComponent } from '@inlet/react-pixi'
import { Application } from 'pixi.js'

interface Props {
  
  }

const Ninja = () => {
  const image = './src/MatFace.png';

  const width = 500;
  const height = 500;

  const [x, updateX] = useState(0);
  const [rotate, updateRotate] = useState(0);
  const [scale, updateScale] = useState(1);

  const iter = useRef(0);
  useTick(delta => {
    const i = (iter.current += 0.05 * delta)
    updateX(Math.sin(i) * (width / 10));
    updateRotate((Math.cos(i) * width) / 100);
    updateScale(1 + Math.sin(i) * 0.5);
  })
    
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
  

  
  return (
    <Stage width={500} height={500} options={{ backgroundColor: 0xeef1f5 }}>
      <Ninja/>
    </Stage>
  )
}

export default PixiComp3;