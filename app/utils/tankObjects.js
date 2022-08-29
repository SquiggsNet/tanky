import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/string';

const columns = 10;

export class Position {
  @tracked pos1;
  @tracked pos2;
}

export class Tank {
  @tracked shape = 'default';
  @tracked strength;
  @tracked position = new Position();

  constructor({ shape, strength, position }) {
    this.shape = shape;
    this.strength = strength;
    if (position?.length) {
      this.position = new Position();
      this.position.pos1 = position[0];
      this.position.pos2 = position[1];
    }
  }

  get hasX() {
    return this.position?.pos1 || this.position?.pos1 === 0;
  }

  get hasY() {
    return this.position?.pos2 || this.position?.pos2 === 0;
  }

  get isAssignedLocation() {
    const { hasX, hasY } = this;
    return hasX && hasY;
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
}

export class Player {
  @tracked name;
  @tracked type;
  @tracked units;

  constructor({ name, type, units }) {
    this.name = name;
    this.type = type;
    this.units = units;
  }
}