import { Instrument } from '../entities/Instrument';
import { InstrumentId } from '../value-objects/InstrumentId';
import { ExchangeId } from '../value-objects/ExchangeId';

export interface InstrumentRepositoryPort {
  save(instrument: Instrument): Promise<void>;
  findById(id: InstrumentId): Promise<Instrument | null>;
  findAll(): Promise<Instrument[]>;
  findBySymbolAndExchange(symbol: string, exchangeId: ExchangeId): Promise<Instrument | null>;
}
