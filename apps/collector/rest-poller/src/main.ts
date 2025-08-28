/**
 * Nest + 스케줄러
 */
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ScheduleModule, Cron } from '@nestjs/schedule';

@Module({
	imports: [ScheduleModule.forRoot()]
})
class CollectorRestModule {
	@Cron('*/60 * * * * *')	// 60초 마다
	async poll() {
		// TODO: Upbit REST 1m candles 호출 -> Timescale INSERT
		// ex) GET /v1/candles/minutes/1?market=KRW-BTC&count=200
		// await repo.insertCandles(rows)
		console.log('[rest-poller] tick');
	}
}

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(CollectorRestModule);
	// REST 폴러는 HTTP 리슨 필요 없음 (백그라운드 워커)
	// 앱이 종료되지 않도록 유지
}
bootstrap();