import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterInstrumentDto, InstrumentType } from '../../application/dto/RegisterInstrument.dto';
import { RegisterInstrumentCommand } from '../../application/commands/RegisterInstrument.command';
import { GetInstrumentByIdQuery } from '../../application/queries/GetInstrumentById.query';
import { GetInstrumentsQuery } from '../../application/queries/GetInstruments.query';
import { Instrument } from '../../domain/entities/Instrument';

@Controller('instrument')
export class InstrumentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  async registerInstrument(@Body() dto: RegisterInstrumentDto): Promise<Instrument> {
    const command = new RegisterInstrumentCommand(
      dto.symbol,
      dto.exchange,
      dto.type,
      dto.tickSize,
      dto.lotSize,
    );
    return this.commandBus.execute(command);
  }

  @Get(':id')
  async getInstrumentById(@Param('id') id: string): Promise<Instrument | null> {
    const query = new GetInstrumentByIdQuery(id);
    return this.queryBus.execute(query);
  }

  @Get()
  async getInstruments(): Promise<Instrument[]> {
    const query = new GetInstrumentsQuery();
    return this.queryBus.execute(query);
  }
}
