import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interface */
import { PositionRepositoryPort } from '../../domain/repositories/position-repository.port';

/* ORM Entity */
import { PositionEntity } from '../orm/position.entity';

/* Domain Entity */
import { Position } from '../../domain/entities/position';

/* Object Value */
import { PositionId } from '../../domain/value-objects/position-id';
import { AccountId } from '../../domain/value-objects/account-id';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';

@Injectable()
export class PositionRepositoryAdapter implements PositionRepositoryPort {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
  ) {}

  async save(position: Position): Promise<void> {
    const ormEntity = this.toOrmEntity(position);
    await this.positionRepository.save(ormEntity);
  }

  async findById(positionId: PositionId): Promise<Position | null> {
    const ormEntity = await this.positionRepository.findOne({
      where: { id: positionId.value },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByAccountId(accountId: AccountId): Promise<Position[]> {
    const ormEntities = await this.positionRepository.find({
      where: { accountId: accountId.value },
      order: { openedAt: 'ASC' },
    });
    return ormEntities.map(this.toDomainEntity);
  }

  async findByAccountIdAndInstrumentId(
    accountId: AccountId,
    instrumentId: InstrumentId,
  ): Promise<Position | null> {
    const ormEntity = await this.positionRepository.findOne({
      where: { accountId: accountId.value, instrumentId: instrumentId.value },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  private toOrmEntity(position: Position): PositionEntity {
    const ormEntity = new PositionEntity();
    ormEntity.id = position.id.value;
    ormEntity.accountId = position.accountId.value;
    ormEntity.instrumentId = position.instrumentId.value;
    ormEntity.size = String(position.size);
    ormEntity.entryPrice = String(position.entryPrice);
    ormEntity.stop = String(position.stop);
    // ormEntity.takeProfit = position.takeProfit;
    ormEntity.openedAt = position.openedAt;
    ormEntity.updatedAt = position.updatedAt;
    return ormEntity;
  }

  private toDomainEntity(ormEntity: PositionEntity): Position {
    return Position.fromPersistence(
      new PositionId(ormEntity.id),
      new AccountId(ormEntity.accountId),
      new InstrumentId(ormEntity.instrumentId),
      Number(ormEntity.size),
      Number(ormEntity.entryPrice),
      null,
      null,
      ormEntity.openedAt,
      ormEntity.updatedAt,
    );
  }
}
