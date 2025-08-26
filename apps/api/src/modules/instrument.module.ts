import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { InstrumentOrmEntity } from './infrastructure/orm/Instrument.orm-entity';
// import { InstrumentController } from './infrastructure/controllers/instrument.controller';
// import { InstrumentRepositoryAdapter } from './infrastructure/repositories/InstrumentRepository.adapter';


@Module({
imports: [
	// CqrsModule, TypeOrmModule.forFeature([InstrumentOrmEntity])
],
controllers: [
	// InstrumentController
],
providers: [
	// InstrumentRepositoryAdapter
],
exports: [],
})
export class InstrumentModule {}