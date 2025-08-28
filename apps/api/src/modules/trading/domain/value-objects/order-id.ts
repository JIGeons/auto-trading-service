import { v4 as uuidv4 } from 'uuid';

export class OrderId {
  readonly value: string;

  constructor(value: string = uuidv4()) {
    if (!value) {
      throw new Error('OrderId cannot be empty');
    }
    this.value = value;
  }

  equals(other: OrderId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
