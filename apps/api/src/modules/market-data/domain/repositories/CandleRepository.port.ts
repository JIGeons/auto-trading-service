import { Candle } from '../entities/candle';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';

export interface CandleRepositoryPort {
  save(candle: Candle): Promise<void>;
  findByInstrumentIdAndTimeRange(
    instrumentId: InstrumentId,
    tf: string,
    from: Date,
    to: Date,
  ): Promise<Candle[]>;
}
