import { Order, OrderStatus } from '../entities/order';
import { OrderId } from '../value-objects/order-id';
import { AccountId } from '../value-objects/account-id';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';

export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findById(orderId: OrderId): Promise<Order | null>;
  findByAccountId(accountId: AccountId): Promise<Order[]>;
  findByInstrumentIdAndStatus(
    instrumentId: InstrumentId,
    status: OrderStatus,
  ): Promise<Order[]>;
}
