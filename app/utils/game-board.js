import { Tank } from "./tankObjects";

export const defaultGrid = [10, 10];
export const advancedGrid = [
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
];

export function covertRowColumnsToGrid(rowCol) {
  let rowCount = rowCol[0];
  let columnCount = rowCol[1];

  const grid = [];
  while (rowCount > 0) {
    const row = [];
    while (columnCount > 0) {
      row.push(1);
      columnCount--;
    }
    columnCount = rowCol[1];
    grid.push(row);
    rowCount--;
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