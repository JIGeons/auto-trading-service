import { randomUUID, UUID } from 'crypto';

export class Account {
  private constructor(
    public readonly id: UUID,
    public name: string,
    public balance: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(name: string, initialBalance: number): Account {
    const now = new Date();
    return new Account(randomUUID(), name, initialBalance, now, now);
  }

  static fromPersistence(
    id: UUID,
    name: string,
    balance: number,
    createdAt: Date,
    updatedAt: Date,
  ): Account {
    return new Account(id, name, balance, createdAt, updatedAt);
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    this.balance += amount;
    this.updatedAt = new Date();
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }
    this.balance -= amount;
    this.updatedAt = new Date();
  }
}
