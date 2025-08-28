import { InstrumentId } from '../value-objects/InstrumentId';
import { ExchangeId } from '../value-objects/ExchangeId';
import { InstrumentType } from '../../application/dto/RegisterInstrument.dto';

export class Instrument {
  private constructor(
    public readonly id: InstrumentId,
    public readonly symbol: string,
    public readonly exchange: ExchangeId,
    public readonly type: InstrumentType,
    public readonly tickSize: number,
    public readonly lotSize: number,
  ) {}

  static create(
    symbol: string,
    exchange: ExchangeId,
    type: InstrumentType,
    tickSize: number = 0,
    lotSize: number = 0,
  ): Instrument {
    return new Instrument(
      new InstrumentId(),
      symbol,
      exchange,
      type,
      tickSize,
      lotSize,
    );
  }

  static fromPersistence(
    id: InstrumentId,
    symbol: string,
    exchange: ExchangeId,
    type: InstrumentType,
    tickSize: number,
    lotSize: number,
  ): Instrument {
    return new Instrument(id, symbol, exchange, type, tickSize, lotSize);
  }
}
