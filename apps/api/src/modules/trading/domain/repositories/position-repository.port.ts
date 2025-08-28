import { Position } from '../entities/position';
import { PositionId } from '../value-objects/position-id';
import { AccountId } from '../value-objects/account-id';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';

export interface PositionRepositoryPort {
  save(position: Position): Promise<void>;
  findById(positionId: PositionId): Promise<Position | null>;
  findByAccountId(accountId: AccountId): Promise<Position[]>;
  findByAccountIdAndInstrumentId(
    accountId: AccountId,
    instrumentId: InstrumentId,
  ): Promise<Position | null>;
}
