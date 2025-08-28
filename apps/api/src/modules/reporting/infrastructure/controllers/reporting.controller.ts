import { Controller, Get, Query, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetEquityCurveQuery } from '../../application/queries/GetEquityCurve.query';
import { EquityPoint } from '../../application/dto/EquityPoint';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('equity-curve/:accountId')
  async getEquityCurve(
    @Param('accountId') accountId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<EquityPoint[]> {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const query = new GetEquityCurveQuery(accountId, fromDate, toDate);
    return this.queryBus.execute(query);
  }
}
