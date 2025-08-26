/**
 * 스텁
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Injectable()
export class OutboxPublisher {
	private readonly logger = new Logger(OutboxPublisher.name);

	constructor(
		@InjectDataSource() 
		private readonly ds: DataSource
	) {}

	async publishOnce() {
		const rows = await this.ds.query(`SELECT * FROM outbox WHERE published = false ORDER BY id LIMIT 100`);
		for (const r of rows) {
			// TODO: BullMQ/Redis 등으로 발행
			this.logger.log(`Publishing topic=${r.topic}`);
			await this.ds.query(`UPDATE outbox SET published = true WHERE id = $1`, [r.id]);
		}
	}
}