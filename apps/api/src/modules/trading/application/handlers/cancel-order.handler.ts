import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelOrderCommand } from '../commands/cancel-order.command';
import { ExchangePort } from '../../domain/ports/exchange.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(@Inject(ExchangePort) private readonly exchange: ExchangePort) {}
  async execute(cmd: CancelOrderCommand) {
    const res = await this.exchange.cancelOrder({ brokerOrderId: cmd.brokerOrderId });
    return res.ok ? { ok: true } as const : { ok: false, error: (res as any).error ?? 'REJECTED_BY_BROKER' as const };
  }
}


