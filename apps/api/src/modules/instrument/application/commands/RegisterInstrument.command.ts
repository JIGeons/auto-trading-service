import { InstrumentType } from '../dto/RegisterInstrument.dto';

export class RegisterInstrumentCommand {
  constructor(
    public readonly symbol: string,
    public readonly exchange: string,
    public readonly type: InstrumentType,
    public readonly tickSize?: number,
    public readonly lotSize?: number,
  ) {}
}
