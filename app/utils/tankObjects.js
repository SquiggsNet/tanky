import { tracked } from '@glimmer/tracking';

export class Tank {
  @tracked shape = 'default';
  @tracked strength;
  @tracked turnPositions = [];
  @tracked position;

  constructor({ shape, strength, position }) {
    this.shape = shape;
    this.strength = strength;
    if (position?.length) {
      this.position = { pos1: position[0], pos2: position[1] };
    }
  }

  get hasX() {
    return !!(this.position?.pos1 || this.position?.pos1 === 0);
  }

  get hasY() {
    return !!(this.position?.pos2 || this.position?.pos2 === 0);
  }

  get isAssignedLocation() {
    const { hasX, hasY } = this;
    return hasX && hasY;
  }

  get validCoordinates() {
    const { isAssignedLocation } = this;
    return (
      isAssignedLocation &&
      10 > this.position?.pos1 &&
      this.position?.pos1 >= 0 &&
      10 > this.position?.pos2 &&
      this.position?.pos2 >= 0
    );
  }

  get xLocation() {
    const { hasX, position } = this;
    if (!hasX) {
      return undefined;
    }

    return position?.pos1 * 100;
  }

  get yLocation() {
    const { hasY, position } = this;
    if (!hasY) {
      return undefined;
    }

    return position?.pos2 * 100;
  }

  get hasForwardMovement() {
    const { turnPositions } = this;
    if (!turnPositions) {
      return undefined;
    }
    const yPositions = turnPositions.map((t) => t.pos2);
    const uniqueYPositions = yPositions.filter((v, i, a) => a.indexOf(v) === i)
    return uniqueYPositions.length > 1;
  }

  get tilesMovedCount() {
    const { turnPositions } = this;
    if (!turnPositions) {
      return undefined;
    }

    return turnPositions.length - 1;
  }
}

export class Player {
  @tracked name;
  @tracked type;
  @tracked units;
  @tracked shotPositions = [];

  constructor({ name, type, units }) {
    this.name = name;
    this.type = type;
    this.units = units;
  }

  get totalTurnMoves() {
    const { units } = this;
    if (!units) {
      return 0;
    }
    return units.reduce((partialSum, a) => partialSum + a.tilesMovedCount, 0);
  }

  get hasForwardMovement() {
    const { units } = this;
    if (!units) {
      return false;
    }
    return units.some((u) => u.hasForwardMovement);
  }

  get isTankMovementComplete() {
    const { totalTurnMoves, hasForwardMovement } = this;
    return totalTurnMoves === 6 && hasForwardMovement;
  }
}
