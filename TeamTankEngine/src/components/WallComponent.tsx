import { Container, Sprite } from '@inlet/react-pixi';
import React, { useState } from "react";

interface Props {

}

const Wall = () => {
    const image = './src/images/wall.jpg';
    const wallWidth = 50;
    const wallHeight = 50;

    return (
        <Container>
            <Sprite x={175} y={25} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={175} y={75} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={175} y={125} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={25} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={75} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={125} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={175} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={225} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={275} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={425} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={475} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={525} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={575} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={625} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={675} y={275} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={275} y={325} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={275} y={375} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={275} y={425} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={275} y={475} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={525} y={675} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={525} y={625} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
            <Sprite x={525} y={575} anchor={0.5} image={image} width={wallWidth} height={wallHeight} />
        </Container>
    );
};

export const WallComponent: React.FC<Props> = ({ }) => {
    return (
        <Wall />
    )
}

export const coordinates: any = [
    { x: 175, y: 25 }, { x: 175, y: 75 },
    { x: 175, y: 125 }, { x: 25, y: 275 },
    { x: 75, y: 275 }, { x: 125, y: 275 },
    { x: 175, y: 275 }, { x: 225, y: 275 },
    { x: 275, y: 275 }, { x: 425, y: 275 },
    { x: 475, y: 275 }, { x: 525, y: 275 },
    { x: 575, y: 275 }, { x: 625, y: 275 },
    { x: 675, y: 275 }, { x: 275, y: 375 },
    { x: 275, y: 425 }, { x: 275, y: 475 },
    { x: 525, y: 675 }, { x: 525, y: 625 },
    { x: 525, y: 575 }
]