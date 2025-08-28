import { v4 as uuidv4 } from 'uuid';

export class ExchangeId {
  readonly value: string;

  constructor(value: string = uuidv4()) {
    if (!value) {
      throw new Error('ExchangeId cannot be empty');
    }
    this.value = value;
  }

  equals(other: ExchangeId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
