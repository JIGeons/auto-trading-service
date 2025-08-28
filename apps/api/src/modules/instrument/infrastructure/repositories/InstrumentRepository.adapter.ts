import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstrumentRepositoryPort } from '../../domain/repositories/InstrumentRepository.port';
import { Instrument } from '../../domain/entities/Instrument';
import { InstrumentOrmEntity } from '../orm/Instrument.orm-entity';
import { InstrumentId } from '../../domain/value-objects/InstrumentId';
import { ExchangeId } from '../../domain/value-objects/ExchangeId';

@Injectable()
export class InstrumentRepositoryAdapter implements InstrumentRepositoryPort {
  constructor(
    @InjectRepository(InstrumentOrmEntity)
    private readonly instrumentRepository: Repository<InstrumentOrmEntity>,
  ) {}

  async save(instrument: Instrument): Promise<void> {
    const ormEntity = this.toOrmEntity(instrument);
    await this.instrumentRepository.save(ormEntity);
  }

  async findById(instrumentId: InstrumentId): Promise<Instrument | null> {
    const ormEntity = await this.instrumentRepository.findOne({
      where: { id: instrumentId.value },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findBySymbolAndExchange(
    symbol: string,
    exchange: ExchangeId,
  ): Promise<Instrument | null> {
    const ormEntity = await this.instrumentRepository.findOne({
      where: { symbol, exchange: exchange.value },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findAll(): Promise<Instrument[]> {
    const ormEntities = await this.instrumentRepository.find();
    return ormEntities.map(this.toDomainEntity);
  }

  private toOrmEntity(instrument: Instrument): InstrumentOrmEntity {
    const ormEntity = new InstrumentOrmEntity();
    ormEntity.id = instrument.id.value;
    ormEntity.symbol = instrument.symbol;
    ormEntity.exchange = instrument.exchange.value;
    ormEntity.type = instrument.type;
    ormEntity.tickSize = instrument.tickSize;
    ormEntity.lotSize = instrument.lotSize;
    return ormEntity;
  }

  private toDomainEntity(ormEntity: InstrumentOrmEntity): Instrument {
    return Instrument.fromPersistence(
      new InstrumentId(ormEntity.id),
      ormEntity.symbol,
      new ExchangeId(ormEntity.exchange),
      ormEntity.type,
      ormEntity.tickSize,
      ormEntity.lotSize,
    );
  }
}
