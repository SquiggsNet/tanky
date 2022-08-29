import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { populatePlayerTanks } from './../utils/game-board';
import { Player } from './../utils/tankObjects';

const tanksPerPerson = 6;

// const gameState = [
//   {
//     label: 'start-game',
//     actions: [
//       'name-p1',
//       'name-p2',
//       'ship-assignment-p1',
//       'ship-assignment-p2',
//       'finish',
//     ],
//   },
//   {
//     label: 'turn-succession',
//   },
// ];

export default class IndexController extends Controller {
  @tracked boardType = 'default';
  @tracked playerOne;
  @tracked playerTwo;

  @tracked playerNameLabel;
  @tracked playerName;

  @tracked gameStarted = true;
  @tracked isEnterPlayerInfo = false;
  @tracked isEnterPlayerTanks = false;

  @tracked enterPlayerTanks = 'p1';

  @tracked shipIndex = 0;

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
      const startPosition = [4.5, -1.25];
      const playerOneTanks = populatePlayerTanks(tanksPerPerson, startPosition);
      this.playerOne = new Player({
        name: this.playerName,
        type: 'p1',
        units: playerOneTanks,
      });

      this.startPlayerCreation();
    } else if (!playerTwo) {
      const startPosition = [4.5, 10.25];
      const playerTwoTanks = populatePlayerTanks(tanksPerPerson, startPosition);
      this.playerTwo = new Player({
        name: this.playerName,
        type: 'p2',
        units: playerTwoTanks,
      });
      this.cancelPlayerCreation();
      this.isEnterPlayerTanks = true;
      this.gameStarted = true;
    }
  }

  @action
  cellActionClick(rowIndex, cellIndex) {
    // TODO: handle tank selection
    const {
      isEnterPlayerTanks,
      enterPlayerTanks,
      playerOne,
      playerTwo,
      shipIndex,
    } = this;
    if (!isEnterPlayerTanks) {
      return;
    }

    const tank =
      enterPlayerTanks === 'p1'
        ? playerOne.units[shipIndex]
        : playerTwo.units[shipIndex];

    if (tank) {
      tank.position.pos1 = cellIndex;
      tank.position.pos2 = rowIndex;
      this.shipIndex = shipIndex + 1;
      if (this.shipIndex >= tanksPerPerson) {
        this.shipIndex = 0;
        if (enterPlayerTanks === 'p1') {
          this.enterPlayerTanks = 'p2';
        } else {
          this.enterPlayerTanks = 'p1';
        }
      }
    }
  }

  @action
  actionAutoName() {
    this.playerName = 'Mecloving';
    this.actionConfirmName();
    this.playerName = 'Squiggs';
    this.actionConfirmName();
  }
}
