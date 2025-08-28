import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CandleEntity } from './infrastructure/orm/candle.entity';
import { CandleRepositoryPort } from './domain/repositories/CandleRepository.port';
import { CandleRepositoryAdapter } from './infrastructure/repositories/CandleRepository.adapter';
import { GetCandlesHandler } from './application/handlers/GetCandles.handler';

/* Controllers */
import { MarketDataController } from './infrastructure/controllers/market-data.controller';
import { CandlesController } from './infrastructure/controllers/candles.controller';


const queryHandlers = [GetCandlesHandler];
const repositories = [
  { provide: 'CandleRepositoryPort', useClass: CandleRepositoryAdapter },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([CandleEntity]),
    // CqrsModule,
  ],
  controllers: [CandlesController],
  // providers: [...queryHandlers, ...repositories],
  // exports: ['CandleRepositoryPort'], // Export the port for other modules to use
})
export class MarketDataModule {}
