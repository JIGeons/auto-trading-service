/* Modules */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MarketDataModule } from './modules/market-data/market-data.module';
import { TradingModule } from './modules/trading/trading.module';

/* Config */
import envConfig from './config/env.config';
import typeOrmConfig from './config/typeorm.config';

// import { CqrsModule } from '@nestjs/cqrs';
// import { typeormConfig } from './config/typeorm.config';
// import { InstrumentModule } from './modules/instrument/instrument.module';
// import { ReportingModule } from './modules/reporting/reporting.module';

/* Controller */
import { AppController } from './app.controller';

/* Service */
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [envConfig] }),
    TypeOrmModule.forRootAsync({ useFactory: typeOrmConfig }),
    MarketDataModule,
    TradingModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
