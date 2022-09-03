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
    } else if (gameState === 'fire-placement-round') {
      return 'Confirm Shots Fired';
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
        const hasMovesRemaining = !!(3 - unitSelected.tilesMovedCount) && unitSelected.player.totalTurnMoves < 6;
        const down = tiles.find(
          (t) =>
            t.position.pos1 === unitSelected.position.pos1 &&
            t.position.pos2 === unitSelected.position.pos2 + 1
        );
        if (down) {
          const canDown = (unitSelected?.player?.type === 'p1' && hasMovesRemaining) ||
          (unitSelected?.player?.type === 'p2' && down.position === unitSelected.turnPositions[unitSelected.turnPositions.length - 2]);
          if (canDown) {
            validTiles.push(down);
          }
        }
        const up = tiles.find(
          (t) =>
            t.position.pos1 === unitSelected.position.pos1 &&
            t.position.pos2 === unitSelected.position.pos2 - 1
        );
        if (up) {
          const canUp = (unitSelected?.player?.type === 'p2' && hasMovesRemaining) ||
          (unitSelected?.player?.type === 'p1' && up.position === unitSelected.turnPositions[unitSelected.turnPositions.length - 2]);
          if (canUp) {
            validTiles.push(up);
          }
        }
        const right = tiles.find(
          (t) =>
            t.position.pos1 === unitSelected.position.pos1 + 1 &&
            t.position.pos2 === unitSelected.position.pos2
        );
        if (right) {
          const canRight = hasMovesRemaining || right.position === unitSelected.turnPositions[unitSelected.turnPositions.length - 2]
          if (canRight) {
            validTiles.push(right);
          }
        }
        const left = tiles.find(
          (t) =>
            t.position.pos1 === unitSelected.position.pos1 - 1 &&
            t.position.pos2 === unitSelected.position.pos2
        );
        if (left) {
          const canLeft = hasMovesRemaining || left.position === unitSelected.turnPositions[unitSelected.turnPositions.length - 2]
          if (canLeft) {
            validTiles.push(left);
          }
        }
      }
    } else if (gameState === 'fire-placement-round') {
      validTiles = this.playerOne?.shotPositions?.length >= 6 ? [] : tiles;
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

    let shotTiles = [];
    const { playerOne, playerTwo } = this;
    if (playerOne?.shotPositions) {
      for (const pos of playerOne?.shotPositions) {
        const tile = tiles.find((t) => t.position === pos);
        if (tile) {
          shotTiles.push(tile)
          tile.playerOneShot = true;
        }
      }
    }
    let nonShotTiles = tiles.filter((tile) => !shotTiles.includes(tile));
    nonShotTiles.map((t) => t.playerOneShot = false);
    shotTiles = [];
    if (playerTwo?.shotPositions) {
      for (const pos of playerTwo?.shotPositions) {
        const tile = tiles.find((t) => t.position === pos);
        if (tile) {
          shotTiles.push(tile)
          tile.playerTwoShot = true;
        }
      }
    }
    nonShotTiles = tiles.filter((tile) => !shotTiles.includes(tile));
    nonShotTiles.map((t) => t.playerTwoShot = false);

    return grid;
  }

  get playerOne() {
    return this.args.playerOne;
  }

  get playerTwo() {
    return this.args.playerTwo;
  }

  get units() {
    const { playerOne, playerTwo } = this;
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
    const { units, gameState, playerOne, playerTwo } = this;
    let isDisabled = true;
    if (units.length) {
      if (gameState === 'enter-player-tanks') {
        isDisabled = !units.every((unit) => unit.validCoordinates);
      } else if (gameState === 'first-round-movement') {
        isDisabled = !playerOne.isTankMovementComplete || !playerTwo.isTankMovementComplete;
      } else if (gameState === 'fire-placement-round') {
        // Insert shot count
        // isDisabled = !playerOne.isTankMovementComplete || !playerTwo.isTankMovementComplete;
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
