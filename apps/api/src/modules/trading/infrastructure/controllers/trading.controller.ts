import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

/* Commands */
import { PlaceOrderCommand } from '../../application/commands/place-order.command';
import { CancelOrderCommand } from '../../application/commands/cancel-order.command';

/* Queries */
import { GetOpenPositionsQuery } from '../../application/queries/get-open-positions.query';

/* Dtos */
import { PlaceOrderDto } from './dto/place-order.dto';

@Controller('api/v1/trading')
export class TradingController {
  constructor(
    private readonly commands: CommandBus, 
    private readonly queries: QueryBus
  ) {}

  @Post('place-order')
  @HttpCode(HttpStatus.OK)
  async place(@Body() body: PlaceOrderDto) {
    return this.commands.execute(new PlaceOrderCommand(body.instrumentId, body.side, body.size, body.idempotencyKey));
  }

  @Post('cancel-order')
  async cancel(@Body() body: { brokerOrderId: string }) {
    return this.commands.execute(new CancelOrderCommand(body.brokerOrderId));
  }

  @Get('positions')
  async positions(@Query('accountId') accountId: string) {
    return this.queries.execute(new GetOpenPositionsQuery(accountId));
  }
}
