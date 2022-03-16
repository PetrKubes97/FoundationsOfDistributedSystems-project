import { Stage, Sprite, useTick } from '@inlet/react-pixi';
import React, { useState, useEffect } from "react";
import { TankComponent } from './components/TankComponent'
import { WallComponent } from './components/WallComponent'

interface Props {

}

let width = 700;
let height = 700;

export const PixiComp3: React.FC<Props> = ({ }) => {

  return (
    <>
      <Stage width={width} height={height} options={{ backgroundColor: 0x505152 }}>
        <TankComponent />
        <WallComponent />
      </Stage>
    </>
  )
}

export default PixiComp3;