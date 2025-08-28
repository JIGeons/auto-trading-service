import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrdersQuery } from '../queries/GetOrders.query';
import { Order } from '../../domain/entities/order';
import type { OrderRepositoryPort } from '../../domain/repositories/order-repository.port';
import { AccountId } from '../../domain/value-objects/account-id';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';
import { Inject } from '@nestjs/common';

@QueryHandler(GetOrdersQuery)
export class GetOrdersHandler implements IQueryHandler<GetOrdersQuery> {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort
  ) {}

  async execute(query: GetOrdersQuery): Promise<Order[]> {
    const accountId = new AccountId(query.accountId);

    if (query.instrumentId && query.status) {
      const instrumentId = new InstrumentId(query.instrumentId);
      return this.orderRepository.findByInstrumentIdAndStatus(
        instrumentId,
        query.status,
      );
    } else if (query.accountId) {
      return this.orderRepository.findByAccountId(accountId);
    }

    // TODO: Add more complex filtering by date range, etc.
    return [];
  }
}
