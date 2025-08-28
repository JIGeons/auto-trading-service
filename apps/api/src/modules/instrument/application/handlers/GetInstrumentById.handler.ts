import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInstrumentByIdQuery } from '../queries/GetInstrumentById.query';
import { Instrument } from '../../domain/entities/Instrument';
import * as InstrumentRepositoryPort from '../../domain/repositories/InstrumentRepository.port';
import { InstrumentId } from '../../domain/value-objects/InstrumentId';
import { Inject } from '@nestjs/common';

@QueryHandler(GetInstrumentByIdQuery)
export class GetInstrumentByIdHandler implements IQueryHandler<GetInstrumentByIdQuery> {
  constructor(
    @Inject('InstrumentRepositoryPort')
    private readonly instrumentRepository: InstrumentRepositoryPort.InstrumentRepositoryPort,
  ) {}

  async execute(query: GetInstrumentByIdQuery): Promise<Instrument | null> {
    const instrumentId = new InstrumentId(query.id);
    return this.instrumentRepository.findById(instrumentId);
  }
}
