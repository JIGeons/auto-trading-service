import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCandlesQuery } from '../queries/GetCandles.query';
import { Candle } from '../../domain/entities/candle';
import type { CandleRepositoryPort } from '../../domain/repositories/CandleRepository.port';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';
import { Inject } from '@nestjs/common';

@QueryHandler(GetCandlesQuery)
export class GetCandlesHandler implements IQueryHandler<GetCandlesQuery> {
  constructor(
    @Inject('CandleRepositoryPort')
    private readonly candleRepository: CandleRepositoryPort,
  ) {}

  async execute(query: GetCandlesQuery): Promise<Candle[]> {
    const instrumentId = new InstrumentId(query.instrumentId);
    return this.candleRepository.findByInstrumentIdAndTimeRange(
      instrumentId,
      query.tf,
      query.from,
      query.to,
    );
  }
}
