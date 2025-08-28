import { IsUUID, IsIn, IsNumber, IsPositive, IsString } from 'class-validator';

export class PlaceOrderDto {
  @IsUUID() instrumentId!: string;
  @IsIn(['BUY','SELL']) side!: 'BUY'|'SELL';
  @IsNumber() @IsPositive() size!: number;
  @IsString() idempotencyKey!: string;
}


