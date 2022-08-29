import Component from '@glimmer/component';
import { action } from '@ember/object';
import {
  defaultGrid,
  advancedGrid,
  covertRowColumnsToGrid,
} from './../utils/game-board';

export default class GameBoardComponent extends Component {
  get grid() {
    const { boardType } = this.args;
    let grid;
    if (boardType === 'default') {
      grid = covertRowColumnsToGrid(defaultGrid);
    } else {
      grid = advancedGrid;
    }
    return grid;
  }

  @action
  cellActionClick(rowIndex, cellIndex) {
    const { cellActionClick } = this.args;

    if ('function' === typeof cellActionClick) {
      cellActionClick(rowIndex, cellIndex);
    }
  }
}
