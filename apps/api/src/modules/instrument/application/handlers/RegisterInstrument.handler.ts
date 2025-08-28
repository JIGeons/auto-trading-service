import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterInstrumentCommand } from '../commands/RegisterInstrument.command';
import * as InstrumentRepositoryPort from '../../domain/repositories/InstrumentRepository.port';
import { Instrument } from '../../domain/entities/Instrument';
import { ExchangeId } from '../../domain/value-objects/ExchangeId';
import { Inject } from '@nestjs/common';

@CommandHandler(RegisterInstrumentCommand)
export class RegisterInstrumentHandler implements ICommandHandler<RegisterInstrumentCommand> {
  constructor(
    @Inject('InstrumentRepositoryPort')
    private readonly instrumentRepository: InstrumentRepositoryPort.InstrumentRepositoryPort,
  ) {}

  async execute(command: RegisterInstrumentCommand): Promise<Instrument> {
    const exchangeId = new ExchangeId(command.exchange);
    const existingInstrument = await this.instrumentRepository.findBySymbolAndExchange(
      command.symbol,
      exchangeId,
    );

    if (existingInstrument) {
      throw new Error('Instrument already registered');
    }

    const instrument = Instrument.create(
      command.symbol,
      exchangeId,
      command.type,
      command.tickSize,
      command.lotSize,
    );

    await this.instrumentRepository.save(instrument);
    return instrument;
  }
}
