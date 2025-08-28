import { Controller, Get, Query, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCandlesQuery } from '../../application/queries/GetCandles.query';
import { Candle } from '../../domain/entities/candle';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('candles/:instrumentId')
  async getCandles(
    @Param('instrumentId') instrumentId: string,
    @Query('tf') tf: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<Candle[]> {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.queryBus.execute(new GetCandlesQuery(instrumentId, tf, fromDate, toDate));
  }
}
