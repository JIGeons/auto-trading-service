import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from '../commands/PlaceOrder.command';
import type { OrderRepositoryPort } from '../../domain/repositories/order-repository.port';
import type { AccountRepositoryPort } from '../../domain/repositories/account-repository.port';
import type { PositionRepositoryPort } from '../../domain/repositories/position-repository.port';
import type { ExchangePort } from '../../domain/ports/ExchangePort';
import { RiskPolicy } from '../../domain/services/RiskPolicy';
import { Order } from '../../domain/entities/order';
import { AccountId } from '../../domain/value-objects/account-id';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';
import { Inject } from '@nestjs/common';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
    @Inject('AccountRepositoryPort')
    private readonly accountRepository: AccountRepositoryPort,
    @Inject('PositionRepositoryPort')
    private readonly positionRepository: PositionRepositoryPort,
    @Inject('ExchangePort')
    private readonly exchangePort: ExchangePort,
    private readonly riskPolicy: RiskPolicy,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<Order> {
    const accountId = new AccountId(command.accountId);
    const instrumentId = new InstrumentId(command.instrumentId);

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const currentPositions = await this.positionRepository.findByAccountId(accountId);
    // TODO: Get current price from market data service
    const currentPrice = command.price || 100; // Dummy price for now

    await this.riskPolicy.checkOrderPreconditions(
      account,
      instrumentId,
      command.side,
      command.size,
      currentPrice,
      currentPositions,
    );

    const order = Order.create(accountId, instrumentId, command.side, command.size);
    await this.orderRepository.save(order);

    // Send order to exchange (Python strategy engine)
    const exchangeResponse = await this.exchangePort.placeOrder({
      instrumentId,
      side: command.side,
      size: command.size,
      price: command.price,
      idempotencyKey: command.idempotencyKey,
    });

    if (exchangeResponse.status === 'REJECTED') {
      order.reject();
      await this.orderRepository.save(order);
      throw new Error(exchangeResponse.message || 'Order rejected by exchange');
    }

    // TODO: Handle partial fills and updates from exchange asynchronously
    // For now, assume it's filled immediately for simplicity
    order.fill(command.size);
    await this.orderRepository.save(order);

    // TODO: Update position based on order fill

    return order;
  }
}
