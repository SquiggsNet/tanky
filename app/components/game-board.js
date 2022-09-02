import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class GameBoardComponent extends Component {
  get gameState() {
    return this.args?.gameState;
  }

  get actionButtonText() {
    const { gameState } = this;
    if (gameState === 'enter-player-tanks') {
      return 'Confirm Tank Placement';
    } else if (gameState === 'first-round-movement') {
      return 'Confirm Tank Movement';
    }
    return '';
  }

  get grid() {
    const { args, unitSelected, units, gameState } = this;

    const grid = args.grid;
    const tiles = grid?.flat() || [];

    const uesdPositions = units?.map((unit) => unit.position) || [];

    let validTiles = [];
    if (unitSelected) {
      if (gameState === 'enter-player-tanks') {
        if (unitSelected?.player?.type === 'p1') {
          validTiles = [...grid[0]];
        } else if (unitSelected?.player?.type === 'p2') {
          validTiles = [...grid[grid.length - 1]];
        }
      } else if (gameState === 'first-round-movement') {
        const down = tiles.find(
          (t) =>
            t.position.pos1 === unitSelected.position.pos1 &&
            t.position.pos2 === unitSelected.position.pos2 + 1
        );
        if (down) {
          validTiles.push(down);
        }
        const up = tiles.find(
          (t) =>
            t.position.pos1 === unitSelected.position.pos1 &&
            t.position.pos2 === unitSelected.position.pos2 - 1
        );
        if (up) {
          validTiles.push(up);
        }
        const right = tiles.find(
          (t) =>
            t.position.pos1 === unitSelected.position.pos1 + 1 &&
            t.position.pos2 === unitSelected.position.pos2
        );
        if (right) {
          validTiles.push(right);
        }
        const left = tiles.find(
          (t) =>
            t.position.pos1 === unitSelected.position.pos1 - 1 &&
            t.position.pos2 === unitSelected.position.pos2
        );
        if (left) {
          validTiles.push(left);
        }
      }
    }

    validTiles = validTiles.filter(
      (tile) => !uesdPositions.includes(tile.position)
    );
    const inValidTiles = tiles.filter((tile) => !validTiles.includes(tile));
    for (const tile of validTiles) {
      tile.canUse = true;
    }
    for (const tile of inValidTiles) {
      tile.canUse = false;
    }

    return grid;
  }

  get units() {
    const { playerOne, playerTwo } = this.args;
    let units = [];

    if (playerOne?.units) {
      units = [...playerOne.units];
    }
    if (playerTwo?.units) {
      units = [...units, ...playerTwo.units];
    }

    return units;
  }

  get unitSelected() {
    return this.args.tankSelected;
  }

  get actionButtonDisabled() {
    const { units, gameState } = this;
    let isDisabled = true;
    if (units.length) {
      if (gameState === 'enter-player-tanks') {
        isDisabled = !units.every((unit) => unit.validCoordinates);
      } else if (gameState === 'first-round-movement') {
        isDisabled = true;
      }
    }

    return isDisabled;
  }

  @action
  cellActionClick(rowIndex, cellIndex) {
    const { cellActionClick } = this.args;

    if ('function' === typeof cellActionClick) {
      cellActionClick(rowIndex, cellIndex);
    }
  }

  @action
  tankActionClick(tank) {
    const { tankActionClick } = this.args;

    if ('function' === typeof tankActionClick) {
      tankActionClick(tank);
    }
  }

  @action
  actionButtonClick() {
    const { actionButtonClick } = this.args;

    if ('function' === typeof actionButtonClick) {
      actionButtonClick();
    }
  }
}
