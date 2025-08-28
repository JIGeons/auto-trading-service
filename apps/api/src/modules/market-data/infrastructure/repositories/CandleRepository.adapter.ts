import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CandleRepositoryPort } from '../../domain/repositories/CandleRepository.port';
import { Candle } from '../../domain/entities/candle';
import { CandleEntity } from '../orm/candle.entity';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';

@Injectable()
export class CandleRepositoryAdapter implements CandleRepositoryPort {
  constructor(
    @InjectRepository(CandleEntity)
    private readonly candleRepository: Repository<CandleEntity>,
  ) {}

  async save(candle: Candle): Promise<void> {
    const ormEntity = this.toOrmEntity(candle);
    await this.candleRepository.save(ormEntity);
  }

  async findByInstrumentIdAndTimeRange(
    instrumentId: InstrumentId,
    tf: string,
    from: Date,
    to: Date,
  ): Promise<Candle[]> {
    const ormEntities = await this.candleRepository.find({
      where: {
        instrumentId: instrumentId.value,
        tf,
        time: Between(from, to), // Assuming Between is imported from typeorm
      },
      order: { time: 'ASC' },
    });
    return ormEntities.map(this.toDomainEntity);
  }

  private toOrmEntity(candle: Candle): CandleEntity {
    const ormEntity = new CandleEntity();
    ormEntity.time = candle.time;
    ormEntity.instrumentId = candle.instrumentId.value;
    ormEntity.tf = candle.tf;
    ormEntity.open = candle.open;
    ormEntity.high = candle.high;
    ormEntity.low = candle.low;
    ormEntity.close = candle.close;
    ormEntity.volume = candle.volume;
    return ormEntity;
  }

  private toDomainEntity(ormEntity: CandleEntity): Candle {
    return new Candle(
      ormEntity.time,
      new InstrumentId(ormEntity.instrumentId),
      ormEntity.tf,
      ormEntity.open,
      ormEntity.high,
      ormEntity.low,
      ormEntity.close,
      ormEntity.volume,
    );
  }
}
