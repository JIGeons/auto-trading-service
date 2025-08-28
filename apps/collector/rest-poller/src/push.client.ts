import axios from 'axios';

export async function pushCandlesBulk(apiBase: string, items: any, idem?: string) {
	await axios.post(
		`${apiBase}/api/v1/market-data/candles/bulk-upsert`,
		{ items, idempotencyKey: idem },
		{
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
				...(idem ? { 'Idempotency-Key': idem } : {}),
			},
			// gzip 사용 시:
			// transformRequest: [(data) => gzipSync(Buffer.from(JSON.stringify(data)))],
			// headers: { 'Content-Encoding': 'gzip', ... }
		},
	);
}