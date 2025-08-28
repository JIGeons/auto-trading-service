import { UUID, randomUUID } from 'crypto';
import { PositionId } from '../value-objects/position-id';
import { AccountId } from '../value-objects/account-id';
import { InstrumentId } from '@api/modules/instrument/domain/value-objects/InstrumentId';

export class Position {
  private constructor(
    public readonly id: PositionId,
    public readonly accountId: AccountId,
    public readonly instrumentId: InstrumentId,
    public size: number,
    public entryPrice: number,
    public stopLoss: number | null,
    public takeProfit: number | null,
    public openedAt: Date = new Date(),
    public updatedAt: Date,
    public stop?: number,
  ) {}

  static fromPersistence(
    id: PositionId,
    accountId: AccountId,
    instrumentId: InstrumentId,
    size: number,
    entryPrice: number,
    stopLoss: number | null,
    takeProfit: number | null,
    openedAt: Date,
    updatedAt: Date,
  ): Position {
    return new Position(id, accountId, instrumentId, size, entryPrice, stopLoss, takeProfit, openedAt, updatedAt);
  }

  static open(
    accountId: AccountId,
    instrumentId: InstrumentId,
    size: number,
    entryPrice: number,
    stopLoss: number | null = null,
    takeProfit: number | null = null,
  ): Position {
    const now = new Date();
    return new Position(
      new PositionId(),
      accountId,
      instrumentId,
      size,
      entryPrice,
      stopLoss,
      takeProfit,
      now,
      now,
    );
  }

  close(closePrice: number, closeSize: number = this.size): void {
    if (closeSize > this.size) {
      throw new Error('Cannot close more than existing size');
    }
    this.size -= closeSize;
    this.updatedAt = new Date();
    // PnL calculation logic can be added here or in a separate service
  }

  updateStopLoss(newStopLoss: number): void {
    this.stopLoss = newStopLoss;
    this.updatedAt = new Date();
  }

  updateTakeProfit(newTakeProfit: number): void {
    this.takeProfit = newTakeProfit;
    this.updatedAt = new Date();
  }
}
