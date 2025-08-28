import { NestFactory } from '@nestjs/core';
import { Logger, Module, OnModuleInit } from '@nestjs/common';

@Module({})
class CollectorWsModule implements OnModuleInit {
	private logger = new Logger(CollectorWsModule.name);

	async onModuleInit() {
		// TODO: Upbit WS 연결 (wss://api.upbit.com/websocket/v1)
		// ticker/trade/orderbook 구독 -> DB/Redis 적재
		this.logger.log('[ws-worker] init');
	}
}

async function bootstrap() {
	await NestFactory.createApplicationContext(CollectorWsModule);
}
bootstrap();