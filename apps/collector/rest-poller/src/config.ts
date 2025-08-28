import * as dotenv from 'dotenv';
dotenv.config();

export const Config = {
	// Upbit REST
	MARKETS: (process.env.MARKETS || 'KRW-BTC, KRW-ETH').split(',').map(s => s.trim()),
	POLL_INTERVAL_SEC: parseInt(process.env.POLL_INTERVAL_SEC || '60', 10),	// 기본 60초
	// '1,5' 같이 콤마로 여러 타임프레임 지원
	TF_LIST: (process.env.TF_LIST || '1,5')
		.split(',')
		.map(s => parseInt(s.trim(), 10))
		.filter(n => !!n),

	// API endpoint (auto-trading-service)
	API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3100',

	// 안전장치
  UPSERT_BATCH_SIZE: parseInt(process.env.UPSERT_BATCH_SIZE || '500', 10),
	IDEMPOTENCY_PREFIX: process.env.IDEMPOTENCY_PREFIX || 'collector-rest'
}