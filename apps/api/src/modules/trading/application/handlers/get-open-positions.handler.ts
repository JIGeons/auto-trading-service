import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOpenPositionsQuery } from '../queries/get-open-positions.query';
import { Injectable } from '@nestjs/common';
import { PositionRepo } from '../../infrastructure/repositories/position.repo';

@Injectable()
@QueryHandler(GetOpenPositionsQuery)
export class GetOpenPositionsHandler implements IQueryHandler<GetOpenPositionsQuery> {
  constructor(private readonly positions: PositionRepo) {}
  async execute(q: GetOpenPositionsQuery) {
    const rows = await this.positions.findOpenByAccount(q.accountId);
    return { ok: true, data: rows } as const;
  }
}


