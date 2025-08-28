import { randomUUID, UUID } from 'crypto';

export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELED' | 'REJECTED';

export class Order {
  private constructor(
    public readonly id: UUID,
    public readonly accountId: UUID,
    public readonly instrumentId: UUID,
    public readonly side: OrderSide,
    public readonly requestedSize: number,
    public filledSize: number,
    public status: OrderStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    accountId: UUID,
    instrumentId: UUID,
    side: OrderSide,
    requestedSize: number,
  ): Order {
    const now = new Date();
    return new Order(
      randomUUID(),
      accountId,
      instrumentId,
      side,
      requestedSize,
      0,
      'PENDING',
      now,
      now,
    );
  }

  static fromPersistence(
    id: UUID,
    accountId: UUID,
    instrumentId: UUID,
    side: OrderSide,
    requestedSize: number,
    filledSize: number,
    status: OrderStatus,
    createdAt: Date,
    updatedAt: Date,
  ): Order {
    return new Order(id, accountId, instrumentId, side, requestedSize, filledSize, status, createdAt, updatedAt);
  }

  fill(filledSize: number): void {
    this.filledSize += filledSize;
    if (this.filledSize >= this.requestedSize) {
      this.status = 'FILLED';
    } else if (this.filledSize > 0) {
      this.status = 'PARTIALLY_FILLED';
    }
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (this.status === 'PENDING' || this.status === 'PARTIALLY_FILLED') {
      this.status = 'CANCELED';
      this.updatedAt = new Date();
    }
  }

  reject(): void {
    this.status = 'REJECTED';
    this.updatedAt = new Date();
  }
}
