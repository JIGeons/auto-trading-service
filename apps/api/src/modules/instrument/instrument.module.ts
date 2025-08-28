import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// ORM Entity
import { InstrumentOrmEntity } from './infrastructure/orm/Instrument.orm-entity';

// Repositories Ports & Adapters
import { InstrumentRepositoryPort } from './domain/repositories/InstrumentRepository.port';
import { InstrumentRepositoryAdapter } from './infrastructure/repositories/InstrumentRepository.adapter';

// Command Handlers
import { RegisterInstrumentHandler } from './application/handlers/RegisterInstrument.handler';

// Query Handlers
import { GetInstrumentByIdHandler } from './application/handlers/GetInstrumentById.handler';
import { GetInstrumentsHandler } from './application/handlers/GetInstruments.handler';

// Controllers
import { InstrumentController } from './infrastructure/controllers/instrument.controller';

const commandHandlers = [RegisterInstrumentHandler];
const queryHandlers = [GetInstrumentByIdHandler, GetInstrumentsHandler];
const repositories = [
  { provide: 'InstrumentRepositoryPort', useClass: InstrumentRepositoryAdapter },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([InstrumentOrmEntity]),
  ],
  controllers: [InstrumentController],
  providers: [...commandHandlers, ...queryHandlers, ...repositories],
  exports: ['InstrumentRepositoryPort'], // Export the port for other modules to use
})
export class InstrumentModule {}