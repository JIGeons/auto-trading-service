import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInstrumentsQuery } from '../queries/GetInstruments.query';
import { Instrument } from '../../domain/entities/Instrument';
import * as InstrumentRepositoryPort from '../../domain/repositories/InstrumentRepository.port';
import { Inject } from '@nestjs/common';

@QueryHandler(GetInstrumentsQuery)
export class GetInstrumentsHandler implements IQueryHandler<GetInstrumentsQuery> {
  constructor(
    @Inject('InstrumentRepositoryPort')
    private readonly instrumentRepository: InstrumentRepositoryPort.InstrumentRepositoryPort,
  ) {}

  async execute(query: GetInstrumentsQuery): Promise<Instrument[]> {
    return this.instrumentRepository.findAll();
  }
}
