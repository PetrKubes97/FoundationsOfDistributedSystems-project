import { Position } from '../models/GameState';

export const determineRotation = (
  x: number,
  y: number,
  lastRotation: number
): number => {
  switch (x + '|' + y) {
    case '1|0':
      return 0;
    case '1|1':
      return 45;
    case '0|1':
      return 90;
    case '-1|1':
      return 135;
    case '-1|0':
      return 180;
    case '-1|-1':
      return 225;
    case '0|-1':
      return 270;
    case '1|-1':
      return 315;
    case '0|0':
    default:
      return lastRotation;
  }
};

export const checkCollision = (
  pos: Position,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  return pos.x > x - w && pos.x < x + w && pos.y > y - h && pos.y < y + h;
};
