import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

/* ORM Entity */
import { OrderEntity } from '@api/modules/trading/infrastructure/orm/order.entity';
import { PositionEntity } from '@api/modules/trading/infrastructure/orm/position.entity';
import { ExecutionEntity } from '@api/modules/trading/infrastructure/orm/execution.entity';

/* Controllers */
import { TradingController } from '@api/modules/trading/infrastructure/controllers/trading.controller';

/* Interfaces */
import { ExchangePort } from '@api/modules/trading/domain/ports/exchange.port';

/* Repositories */
import { OrderRepository } from '@api/modules/trading/infrastructure/repositories/order.repo';
import { PositionRepo } from '@api/modules/trading/infrastructure/repositories/position.repo';
import { ExecutionRepo } from '@api/modules/trading/infrastructure/repositories/execution.repo';

/* Handlers */
import { PlaceOrderHandler } from '@api/modules/trading/application/handlers/place-order.handler';
import { CancelOrderHandler } from '@api/modules/trading/application/handlers/cancel-order.handler';
import { GetOpenPositionsHandler } from '@api/modules/trading/application/handlers/get-open-positions.handler';

import { UpbitAdapter } from '@api/modules/trading/infrastructure/adapters/upbit-adapter';
import { RiskPolicy } from '@api/modules/trading/domain/policies/risk.policy';

const CommandHandlers = [PlaceOrderHandler, CancelOrderHandler];
const QueryHandlers = [GetOpenPositionsHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([OrderEntity, PositionEntity, ExecutionEntity]),
  ],
  controllers: [TradingController],
  providers: [
    RiskPolicy,
    OrderRepository,
    PositionRepo,
    ExecutionRepo,
    { provide: ExchangePort, useClass: UpbitAdapter },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [],
})
export class TradingModule {}
