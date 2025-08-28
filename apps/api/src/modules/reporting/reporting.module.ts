import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetEquityCurveHandler } from './application/handlers/GetEquityCurve.handler';
import { ReportingController } from './infrastructure/controllers/reporting.controller';
import { TradingModule } from '../trading/trading.module'; // Import TradingModule to use its exported repositories

const queryHandlers = [GetEquityCurveHandler];

@Module({
  imports: [
    CqrsModule,
    TradingModule, // Import TradingModule to access Account, Order, Position repositories
  ],
  providers: [...queryHandlers],
  controllers: [ReportingController],
})
export class ReportingModule {}
