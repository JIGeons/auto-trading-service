import { v4 as uuidv4 } from 'uuid';

export class PositionId {
  readonly value: string;

  constructor(value: string = uuidv4()) {
    if (!value) {
      throw new Error('PositionId cannot be empty');
    }
    this.value = value;
  }

  equals(other: PositionId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
