import { Tank } from './tankObjects';
import { tracked } from '@glimmer/tracking';
import { Position } from './tankObjects'

class Cell {
  @tracked canUse = false;
  @tracked position;

  constructor({ canUse, pos1, pos2 }) {
    this.canUse = canUse;
    this.position = { pos1, pos2 };
  }
}

export const defaultGrid = [10, 10];

export function covertRowColumnsToGrid(rowCol) {
  const rowCount = rowCol[0];
  const columnCount = rowCol[1];

  const grid = [];
  let rowIndex = 0;
  while (rowCount > rowIndex) {
    const row = [];
    let colIndex = 0;
    while (columnCount > colIndex) {
      row.push(new Cell({
        pos1: colIndex,
        pos2: rowIndex
      }));
      colIndex++;
    }
    grid.push(row);
    rowIndex++
  }

  return grid;
}

export function populatePlayerTanks(tanksPerPerson, startPosition) {
  const tanks = [];
  let tankIndex = 0;
  while (tanksPerPerson > tankIndex) {
    const tank = new Tank({
      shape: 'default',
      strength: tankIndex + 1,
      position: startPosition
        ? [startPosition[0] + tankIndex, startPosition[1]]
        : [],
    });
    tanks.push(tank);
    tankIndex++;
  }
  return tanks;
}
