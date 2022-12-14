import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { populatePlayerTanks } from './../utils/game-board';
import { Player } from './../utils/tankObjects';
import { defaultGrid, covertRowColumnsToGrid } from './../utils/game-board';

const tanksPerPerson = 6;

export default class IndexController extends Controller {
  @tracked boardType = 'default';
  @tracked grid;
  @tracked playerOne;
  @tracked playerTwo;

  @tracked playerNameLabel;
  @tracked playerName;

  @tracked gameStarted = true;
  @tracked isEnterPlayerInfo = false;
  @tracked gameState;

  @tracked tankSelected;

  @action
  simulationStart() {
    this.gameStarted = false;
    this.playerOne = undefined;
    this.playerTwo = undefined;
  }

  get saveNameDisabled() {
    const { playerName } = this;
    if (playerName?.length > 2) {
      return false;
    } else {
      return true;
    }
  }

  @action
  updateName(e) {
    this.playerName = e?.target?.value;
  }

  @action
  actionGameStart() {
    this.startPlayerCreation();
  }

  @action
  startPlayerCreation() {
    this.playerName = undefined;
    if (!this.playerOne) {
      this.playerNameLabel = 'Player 1:';
      this.isEnterPlayerInfo = true;
    } else if (!this.playerTwo) {
      this.playerNameLabel = 'Player 2:';
      this.isEnterPlayerInfo = true;
    }
  }

  @action
  cancelPlayerCreation() {
    this.isEnterPlayerInfo = false;
    this.playerName = undefined;
  }

  @action
  actionConfirmName() {
    const { saveNameDisabled, playerOne, playerTwo } = this;
    if (saveNameDisabled) {
      return;
    }
    if (!playerOne) {
      const startPosition = [2, -1.25];
      const playerOneTanks = populatePlayerTanks(tanksPerPerson, startPosition);
      this.playerOne = new Player({
        name: this.playerName,
        type: 'p1',
        units: playerOneTanks,
      });
      for (const tank of playerOneTanks) {
        tank.player = this.playerOne;
      }

      this.startPlayerCreation();
    } else if (!playerTwo) {
      const startPosition = [2, 10.25];
      const playerTwoTanks = populatePlayerTanks(tanksPerPerson, startPosition);
      this.playerTwo = new Player({
        name: this.playerName,
        type: 'p2',
        units: playerTwoTanks,
      });
      for (const tank of playerTwoTanks) {
        tank.player = this.playerTwo;
      }
      this.cancelPlayerCreation();
      this.gameState = 'enter-player-tanks';
      this.gameStarted = true;
      this.grid = covertRowColumnsToGrid(defaultGrid);
    }
  }

  @action
  tankActionClick(tank) {
    const { gameState } = this;
    const canTankUpdate = gameState === 'enter-player-tanks' || gameState === 'first-round-movement';
    if (canTankUpdate) {      
      if (this.tankSelected === tank) {
        this.tankSelected = undefined;
      } else {
        this.tankSelected = tank;
      }
    }
  }

  @action
  cellActionClick(rowIndex, cellIndex) {
    const { gameState, tankSelected, grid } = this;
    if (!gameState || !grid) {
      return;
    }
    
    const cell = grid[rowIndex][cellIndex];
        
    const updateMovements = gameState === 'first-round-movement';
    const canTankUpdate = gameState === 'enter-player-tanks' || updateMovements;
    if (tankSelected && canTankUpdate) {
      if (cell?.canUse) {
        tankSelected.position = cell.position;
        if (updateMovements) {
          if (tankSelected.turnPositions.includes(cell.position)) {
            tankSelected.turnPositions.popObject(cell.position);
          } else {
            tankSelected.turnPositions.pushObject(cell.position);
          }
        }
      }
    }

    if (gameState === 'fire-placement-round') {

      if (this.playerOne.shotPositions.includes(cell.position)) {
        const index = this.playerOne.shotPositions.indexOf(cell.position);
        if (index > -1) {
          const shots = [...this.playerOne.shotPositions];
          shots.splice(index, 1);
          this.playerOne.shotPositions = shots;
        }
      } else {
        this.playerOne.shotPositions.pushObject(cell.position);
      }
    }
  }

  @action
  actionButtonClick() {
    const { gameState } = this;
    if (gameState === 'enter-player-tanks') {
      this.gameState = 'first-round-movement';
    } else if (gameState === 'first-round-movement') {
      this.gameState = 'fire-placement-round';
    }
    this.tankSelected = undefined;
    this.updateTurnStartPosition();
  }
  
  @action
  updateTurnStartPosition() {
    const { playerOne, playerTwo } = this;
    this.assignStartPosition(playerOne.units);
    this.assignStartPosition(playerTwo.units);
  }

  @action
  assignStartPosition(units) {
    if (!units) {
      return;
    }

    for (const unit of units) {
      unit.turnPositions = []
      unit.turnPositions.pushObject(unit.position);
    }
  }
  
  @action
  actionAutoName() {
    this.playerName = 'Mecloving';
    this.actionConfirmName();
    this.playerName = 'Squiggs';
    this.actionConfirmName();
  }

  @action
  autoActionButtonClick() {
    const { gameState, playerOne, playerTwo, grid } = this;
    if (gameState === 'enter-player-tanks') {
      for (const [i, unit] of playerOne?.units?.entries()) {
        const cell = grid[0][i];
        unit.position = cell.position;
      }
      for (const [i, unit] of playerTwo?.units?.entries()) {
        const cell = grid[9][i];
        unit.position = cell.position;
      }
      this.actionButtonClick();
    } else if (gameState === 'first-round-movement') {
      playerOne.units[1].position = grid[1][1].position;
      playerOne.units[2].position = grid[2][2].position;
      playerOne.units[3].position = grid[1][3].position;
      playerTwo.units[1].position = grid[8][1].position;
      playerTwo.units[2].position = grid[7][2].position;
      playerTwo.units[3].position = grid[8][3].position;
      this.actionButtonClick();
    } else if (gameState === 'fire-placement-round') {
      this.playerOne.shotPositions.pushObject(grid[7][1].position);
      this.playerOne.shotPositions.pushObject(grid[6][1].position);
      this.playerOne.shotPositions.pushObject(grid[6][2].position);
      this.playerOne.shotPositions.pushObject(grid[5][2].position);
      this.playerOne.shotPositions.pushObject(grid[7][3].position);
      this.playerOne.shotPositions.pushObject(grid[6][3].position);
    }
    this.tankSelected = undefined;
    this.updateTurnStartPosition();
  }
}
