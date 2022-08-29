import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { populatePlayerTanks } from './../utils/game-board';
import { Player, Tank } from './../utils/tankObjects';

const tanksPerPerson = 6;



export default class IndexController extends Controller {
  @tracked boardType = 'default';
  @tracked gameStarted = true;
  @tracked playerOne;
  @tracked playerTwo;

  @tracked isEnterPlayerInfo = false;
  @tracked playerNameLabel;
  @tracked playerName;

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
      const playerOneTanks = populatePlayerTanks(tanksPerPerson);
      this.playerOne = new Player({
        name: this.playerName,
        type: 'p1',
        units: playerOneTanks,
      });
      playerOneTanks[0].position[0] = 2;
      playerOneTanks[0].position[1] = 3;

      playerOneTanks[1].position[0] = 3;
      playerOneTanks[1].position[1] = 6;

      playerOneTanks[2].position[0] = 3;
      playerOneTanks[2].position[1] = 9;

      playerOneTanks[3].position[0] = 2;
      playerOneTanks[3].position[1] = 6;

      playerOneTanks[4].position[0] = 1;
      playerOneTanks[4].position[1] = 1;
      this.startPlayerCreation();
    } else if (!playerTwo) {
      const playerTwoTanks = populatePlayerTanks(tanksPerPerson);
      this.playerTwo = new Player({
        name: this.playerName,
        type: 'p2',
        units: playerTwoTanks,
      });

      playerTwoTanks[0].position[0] = 10;
      playerTwoTanks[0].position[1] = 1;

      playerTwoTanks[1].position[0] = 9;
      playerTwoTanks[1].position[1] = 3;

      playerTwoTanks[2].position[0] = 8;
      playerTwoTanks[2].position[1] = 5;

      playerTwoTanks[3].position[0] = 10;
      playerTwoTanks[3].position[1] = 10;

      playerTwoTanks[4].position[0] = 9;
      playerTwoTanks[4].position[1] = 6;
      this.cancelPlayerCreation();
      this.gameStarted = true;
    }
  }
}
