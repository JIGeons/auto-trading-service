import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CandleOrmEntity } from '../../infrastructure/orm/candle.orm-entity';
import { CandleBulkItemDto } from '../dto/candle-bulk.dto';

@Injectable()
export class CandleIngestService {
  private instrumentCache = new Map<string, string>(); // market -> instrumentId

  constructor(private readonly ds: DataSource) {}

  private async marketToInstrumentId(market: string): Promise<string> {
    const cached = this.instrumentCache.get(market);
    if (cached) return cached;
    // instruments 테이블에서 조회 (예시)
    const row = await this.ds.query(
      'SELECT id FROM instruments WHERE symbol = $1 LIMIT 1',
      [market],
    );
    if (!row?.[0]?.id) throw new BadRequestException(`Unknown market ${market}`);
    this.instrumentCache.set(market, row[0].id);
    return row[0].id;
  }

  async bulkUpsert(items: CandleBulkItemDto[], idempotencyKey?: string) {
    if (!items?.length) return;

    // (선택) idem 키를 outbox/kv에 기록하여 동일 페이로드 재처리 방지 가능

    // 매핑 + 엔티티 형태로 변환
    const mapped: CandleOrmEntity[] = [];
    for (const it of items) {
      mapped.push({
        time: new Date(it.time),
        instrumentId: await this.marketToInstrumentId(it.market),
        tf: it.tf,
        open: it.open.toString(),
        high: it.high.toString(),
        low: it.low.toString(),
        close: it.close.toString(),
        volume: it.volume.toString(),
      } as CandleOrmEntity);
    }

    const repo = this.ds.getRepository(CandleOrmEntity);
    await repo.upsert(mapped, ['time', 'instrumentId', 'tf']); // ★ TypeORM upsert
  }
}
