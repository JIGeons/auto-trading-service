import { IsISO8601, IsString, IsNumber, IsIn, IsUUID } from 'class-validator';

export class CandleBulkItemDto {
	// ISO UTC
  @IsISO8601() 
	time!: string;

	// ex) "KRW-BTC"
  @IsString() 
	market!: string;

  @IsIn(['1m','5m','15m','1h']) 
	tf!: string;

  @IsNumber() 
	open!: number;

  @IsNumber() 
	high!: number;

  @IsNumber() 
	low!: number;

  @IsNumber() 
	close!: number;

  @IsNumber() 
	volume!: number;
}

export class CandleBulkUpsertDto {
  items!: CandleBulkItemDto[];
  // 선택: idempotency 키 (요청 재시도 시 중복 방지)
  idempotencyKey?: string;
}
