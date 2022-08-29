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
  actionAutoName() {
    const playerOneTanks = populatePlayerTanks(tanksPerPerson);
    this.playerOne = new Player({
      name: 'Mecloving',
      type: 'p1',
      units: playerOneTanks,
    });

    const playerTwoTanks = populatePlayerTanks(tanksPerPerson);
    this.playerTwo = new Player({
      name: 'Squiggs',
      type: 'p2',
      units: playerTwoTanks,
    });
    this.cancelPlayerCreation();
    this.isEnterPlayerTanks = true;
    this.gameStarted = true;
  }

  @action
  actionConfirmName() {
    const { saveNameDisabled, playerOne, playerTwo } = this;
    if (saveNameDisabled) {
      return;
    }
    if (!playerOne) {
      const playerOneTanks = populatePlayerTanks(tanksPerPerson);
      this.playerOne = new Player({
        name: this.playerName,
        type: 'p1',
        units: playerOneTanks,
      });
      playerOneTanks[0].position[0] = 1;
      playerOneTanks[0].position[1] = 1;

      playerOneTanks[1].position[0] = 2;
      playerOneTanks[1].position[1] = 2;

      playerOneTanks[2].position[0] = 3;
      playerOneTanks[2].position[1] = 1;

      playerOneTanks[3].position[0] = 5;
      playerOneTanks[3].position[1] = 1;

      playerOneTanks[4].position[0] = 7;
      playerOneTanks[4].position[1] = 2;
      this.startPlayerCreation();
    } else if (!playerTwo) {
      const playerTwoTanks = populatePlayerTanks(tanksPerPerson);
      this.playerTwo = new Player({
        name: this.playerName,
        type: 'p2',
        units: playerTwoTanks,
      });

      // playerTwoTanks[0].position[0] = 1;
      // playerTwoTanks[0].position[1] = 10;

      // playerTwoTanks[1].position[0] = 3;
      // playerTwoTanks[1].position[1] = 9;

      // playerTwoTanks[2].position[0] = 4;
      // playerTwoTanks[2].position[1] = 9;

      // playerTwoTanks[3].position[0] = 6;
      // playerTwoTanks[3].position[1] = 10;

      // playerTwoTanks[4].position[0] = 9;
      // playerTwoTanks[4].position[1] = 10;
      this.cancelPlayerCreation();
      this.isEnterPlayerTanks = true;
      this.gameStarted = true;
    }
  }

  @action
  cellActionClick(rowIndex, cellIndex) {
    const { isEnterPlayerTanks, playerOne, shipIndex } = this;
    if (!isEnterPlayerTanks) {
      return;
    }

    const tank = playerOne.units[shipIndex];
    if (tank) {
      tank.position.pos1 = cellIndex;
      tank.position.pos2 = rowIndex;
      this.shipIndex = shipIndex + 1;
      if (this.shipIndex >= tanksPerPerson) {
        this.shipIndex = 0;
      }
    }
  }
}
