import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';

export class Candle {
  constructor(
    public readonly time: Date,
    public readonly instrumentId: InstrumentId,
    public readonly tf: string, // Timeframe, e.g., '1m', '5m', '1h'
    public readonly open: number,
    public readonly high: number,
    public readonly low: number,
    public readonly close: number,
    public readonly volume: number,
  ) {}
}
