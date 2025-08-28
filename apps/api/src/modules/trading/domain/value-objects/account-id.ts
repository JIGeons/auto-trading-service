import { v4 as uuidv4 } from 'uuid';

export class AccountId {
  readonly value: string;

  constructor(value: string = uuidv4()) {
    if (!value) {
      throw new Error('AccountId cannot be empty');
    }
    this.value = value;
  }

  equals(other: AccountId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
