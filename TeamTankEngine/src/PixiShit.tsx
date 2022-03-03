import { Stage, Sprite, useTick } from '@inlet/react-pixi';
import React, { useRef } from "react";

import { PixiComponent } from '@inlet/react-pixi'
import { Graphics } from 'pixi.js'

interface Props {
  
  }

interface RectangleProps {
  x: number
  y: number
  width: number
  height: number
  color: number
}

const Rectangle = PixiComponent<RectangleProps, Graphics>('Rectangle', {
  create: () => new Graphics(),
  applyProps: (ins, _, props) => {
    ins.x = props.x
    ins.beginFill(props.color)
    ins.drawRect(props.x, props.y, props.width, props.height)
    ins.endFill()
  },
})

export const PixiComp: React.FC<Props> = ({}) => {  
    return (
        <Stage>
            <Rectangle x={100} y={100} width={100} height={100} color={0xff0000} />
        </Stage>
    )
}

export default PixiComp;