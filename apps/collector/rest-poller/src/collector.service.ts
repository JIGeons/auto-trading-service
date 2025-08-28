import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Config } from './config';
import { UpbitClient } from './upbit.client';
import { pushCandlesBulk } from './push.client';

// tf 숫자 -> 문자열('1m', '5m') 변환
const tfToLabel = (tf: number) => `${tf}m`;

@Injectable()
export class CollectorService {
  private readonly logger = new Logger(CollectorService.name);
  private readonly upbit = new UpbitClient();

  private ready = false;

  async onModuleInit() {
    this.ready = true;
    this.logger.log(
			`Collector ready. api=${Config.API_BASE_URL}, markets=${Config.MARKETS.join(',')}, tf=${Config.TF_LIST.join(',')}`
		);
  }

  // 매 분 폴링 (초 단위 조절 가능)
	// 15초마다 트리거 → 내부에서 interval 제어
  @Cron('*/15 * * * * *')
  async tick() {
    if (!this.ready) return;
    const started = Date.now();

    try {
      for (const tf of Config.TF_LIST) {
        for (const market of Config.MARKETS) {
          await this.pollAndPush(tf, market);
          await this.sleep(200); // Upbit rate-limit 완화 (필요 시 조절)
        }
      }
    } catch (e: any) {
      this.logger.error(`poll error: ${e?.message || e}`);
    } finally {
      const ms = Date.now() - started;
      this.logger.debug(`poll round finished in ${ms}ms`);
    }
  }

  private async pollAndPush(tf: number, market: string) {
    // Upbit 분봉은 최신→과거 순, 우리는 과거→최신으로 정렬 맞춤
		const candles = await this.upbit.getMinuteCandles(tf, market, 200);
    const items = candles
      .slice()
      .reverse()
      .map((c) => ({
        time: c.candle_date_time_utc + 'Z', // ensure UTC
        market,
        tf: tfToLabel(tf),
        open: Number(c.opening_price),
        high: Number(c.high_price),
        low: Number(c.low_price),
        close: Number(c.trade_price),
        volume: Number(c.candle_acc_trade_volume),
      }));

    // 배치 분할 + idem key 부여 (중복 처리 방지)
		const batchSize = Config.UPSERT_BATCH_SIZE;
    for (let i = 0; i < items.length; i += batchSize) {
      const chunk = items.slice(i, i + batchSize);
			
			// idem 키 예: collector-rest:KRW-BTC:1m:2025-08-28T09:12:00Z-2025-08-28T12:00:00Z
			const idem = this.makeIdemKey(market, tfToLabel(tf), chunk);

			// 간단 재시도(최대 3번, 지수 백오프)
			await this.retry(async () => {
				await pushCandlesBulk(Config.API_BASE_URL, chunk, idem);
			}, 3, 300);

			this.logger.log(`pushed candles: market=${market} tf=${tf} n=${items.length}`);
    }
  }

	private makeIdemKey(market: string, tfLabel: string, chunk: Array<{ time: string }>) {
		const first = chunk[0]?.time ?? '';
    const last = chunk[chunk.length - 1]?.time ?? '';
    return `${Config.IDEMPOTENCY_PREFIX}:${market}:${tfLabel}:${first}-${last}`;
	}

  private async sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

	private async retry<T>(fn: () => Promise<T>, tries = 3, baseDelayMs = 300): Promise<T> {
    let lastErr: any;
    for (let i = 0; i < tries; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        const delay = baseDelayMs * Math.pow(2, i); // 300, 600, 1200...
        this.logger.warn(`push retry ${i + 1}/${tries} after error: ${(e as any)?.message || e}, wait ${delay}ms`);
        await this.sleep(delay);
      }
    }
    throw lastErr;
  }
}