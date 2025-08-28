import { Pool } from 'pg';
import { Config } from './config';
import { CandleOrmEntity } from '@api/modules/market-data/infrastructure/orm/candle.orm-entity';

// 테이블 스키마 (시장 문자열을 직접 보존)
// PK: (time, market, tf)
// time: timestamptz, market: text, tf: int
// OHLCV: numeric
const INIT_SQL = `
CREATE TABLE IF NOT EXISTS candles_market (
  time timestamptz NOT NULL,
  market text NOT NULL,
  tf int NOT NULL,
  open numeric NOT NULL,
  high numeric NOT NULL,
  low numeric NOT NULL,
  close numeric NOT NULL,
  volume numeric NOT NULL,
  PRIMARY KEY (time, market, tf)
);
SELECT create_hypertable('candles_market', 'time', if_not_exists => TRUE);

-- 권장 인덱스 (조회 경로)
CREATE INDEX IF NOT EXISTS ix_candles_market_market_tf_time ON candles_market (market, tf, time DESC);
`;

export class TimescaleRepo {
  private pool: Pool;

  async upsertCandles(rows: Array<{
    time: string; // ISO UTC
    instrumentId: string; // uuid (collector가 매핑해줘야 함)
    tf: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>) {
    if (!rows.length) return;
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const text = `
        INSERT INTO candles (time, "instrumentId", tf, open, high, low, close, volume)
        VALUES ${rows.map((_, i) =>
          `($${i*8+1}, $${i*8+2}, $${i*8+3}, $${i*8+4}, $${i*8+5}, $${i*8+6}, $${i*8+7}, $${i*8+8})`
        ).join(',')}
        ON CONFLICT (time, "instrumentId", tf)
        DO UPDATE SET open = EXCLUDED.open, high = EXCLUDED.high, low = EXCLUDED.low,
                      close = EXCLUDED.close, volume = EXCLUDED.volume;
      `;
      const values = rows.flatMap(r => [
        r.time, r.instrumentId, r.tf, r.open, r.high, r.low, r.close, r.volume,
      ]);
      await client.query(text, values);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
