/* Module */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { typeormConfig } from './config/typeorm.config';
// import instrumentModule
// import tradingModule
// import MarketDataModule,
// import RepostingMudule,

/* Controller */
import { AppController } from './app.controller';

/* Service */
import { AppService } from './app.service';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRootAsync({ useFactory: typeormConfig }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
