import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from '../commands/place-order.command';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ExchangePort } from '../../domain/ports/exchange.port';
import { RiskPolicy } from '../../domain/policies/risk.policy';
import { OrderRepository } from '../../infrastructure/repositories/order.repo';
import { Order } from '../../domain/entities/order';

@Injectable()
@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject(ExchangePort) private readonly exchange: ExchangePort,
    private readonly risk: RiskPolicy,
    private readonly orders: OrderRepository,
  ) {}

  async execute(cmd: PlaceOrderCommand) {
    const risk = this.risk.ensurePlaceAllowed(cmd.instrumentId, cmd.size);
    if (!risk.ok) return { ok: false, error: 'RISK_LIMIT' as const };

    const order = new Order(uuid(), cmd.instrumentId, cmd.side, cmd.size, undefined, 'NEW', 0, cmd.idempotencyKey);
    await this.orders.save(order);

    const res = await this.exchange.placeOrder({
      instrumentId: cmd.instrumentId,
      side: cmd.side,
      size: cmd.size,
      idempotencyKey: cmd.idempotencyKey,
    });

    if (!res.ok) {
      order.reject();
      await this.orders.save(order);
      return { ok: false, error: (res as any).error ?? 'REJECTED_BY_BROKER' as const };
    }

    order.accept();
    await this.orders.save(order);
    return { ok: true, orderId: (res as any).orderId } as const;
  }
}


