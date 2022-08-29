import Component from '@glimmer/component';
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
}
