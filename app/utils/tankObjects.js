import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/string';

const columns = 10;

export class Tank {
  @tracked shape = 'default';
  @tracked strength;
  @tracked position = [];

  constructor({ shape, strength, position }) {
    this.shape = shape;
    this.strength = strength;
    this.position = position;
  }

  get isAssignedLocation() {
    const { position } = this;
    return position && position.length === 2;
  }

  get xLocation () {
    const { position } = this;
    const xPosition = position && position[0];
    if (!xPosition) {
      return undefined;
    }

    return (xPosition - 1) * 100;
  }

  get yLocation () {
    const { position } = this;
    const yPosition = position && position[1];
    if (!yPosition) {
      return undefined;
    }

    return (yPosition - 1) * 100;
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