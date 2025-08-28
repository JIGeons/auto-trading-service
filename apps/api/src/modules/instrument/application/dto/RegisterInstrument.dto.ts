import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum InstrumentType {
  CRYPTO = 'CRYPTO',
  EQUITY = 'EQUITY',
}

export class RegisterInstrumentDto {
  @IsString()
  symbol!: string;

  @IsString()
  exchange!: string;

  @IsEnum(InstrumentType)
  type!: InstrumentType;

  @IsNumber()
  @IsOptional()
  tickSize?: number;

  @IsNumber()
  @IsOptional()
  lotSize?: number;
}
