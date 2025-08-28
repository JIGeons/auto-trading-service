import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPositionsQuery } from '../queries/GetPositions.query';
import { Position } from '../../domain/entities/position';
import type { PositionRepositoryPort } from '../../domain/repositories/position-repository.port';
import { AccountId } from '../../domain/value-objects/account-id';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';
import { Inject } from '@nestjs/common';

@QueryHandler(GetPositionsQuery)
export class GetPositionsHandler implements IQueryHandler<GetPositionsQuery> {
  constructor(
    @Inject('PositionRepositoryPort')
    private readonly positionRepository: PositionRepositoryPort
  ) {}

  async execute(query: GetPositionsQuery): Promise<Position[]> {
    const accountId = new AccountId(query.accountId);

    if (query.instrumentId) {
      const instrumentId = new InstrumentId(query.instrumentId);
      const position = await this.positionRepository.findByAccountIdAndInstrumentId(
        accountId,
        instrumentId,
      );
      return position ? [position] : [];
    }

    return this.positionRepository.findByAccountId(accountId);
  }
}
