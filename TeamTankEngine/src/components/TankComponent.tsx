import { Stage, Sprite, useTick } from '@inlet/react-pixi';
import React, { useState, useEffect } from "react";
import { coordinates } from './WallComponent'

interface Props {

}

let lastRotation = 0
let width = 700;
let height = 700;


const Tank = () => {
    const image = './src/images/tank.png';

    const tankWidth = 50;
    const tankHeight = 50;

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [oldPos, setOldPos] = useState({ x: 0, y: 0 })

    useTick(() => {
        var newPositionX = Math.min(Math.max(0 + tankWidth / 2, position.x + direction.x), width - tankWidth / 2)
        var newPositionY = Math.min(Math.max(0 + tankHeight / 2, position.y + direction.y), height - tankHeight / 2)

        function checkCollision(x: number, y: number, w: number, h: number) {
            if (position.x > x - w && position.x < x + w && position.y > y - h && position.y < y + h) {
                return true
            }
            return false
        }

        for (let i = 0; i < coordinates.length; i++) {
            if (checkCollision(coordinates[i]['x'], coordinates[i]['y'], 50, 50)) {
                newPositionX = oldPos.x
                newPositionY = oldPos.y
            }
        }

        setOldPos({ x: position.x, y: position.y })
        setPosition({ x: newPositionX, y: newPositionY });
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
        <Sprite x={position.x} y={position.y} anchor={0.5} image={image} width={tankWidth} height={tankHeight} rotation={rotation * Math.PI / 180} />
    );
};

export const TankComponent: React.FC<Props> = ({ }) => {
    return (
        <Tank />
    )
}