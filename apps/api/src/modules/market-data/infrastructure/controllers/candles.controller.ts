import { Body, Controller, Headers, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandleOrmEntity } from '../orm/candle.orm-entity';

import { CandleBulkUpsertDto } from '../../application/dto/candle-bulk.dto';
import { CandleIngestService } from '../../application/services/candle-ingest.service';


@Controller({ version: '1', path: '/market-data/candles' })
export class CandlesController {
	constructor(
		@InjectRepository(CandleOrmEntity) private readonly repo: Repository<CandleOrmEntity>,
		private readonly candleService: CandleIngestService
	) {}


	@Get('candles')
	async get(
		@Query('instrumentId') instrumentId: string,
		@Query('tf') tf = '1m',
		@Query('from') from?: string,
		@Query('to') to?: string,
	) {
		const qb = this.repo.createQueryBuilder('c')
			.where('c.instrumentId = :instrumentId and c.tf = :tf', { instrumentId, tf })
			.orderBy('c.time', 'ASC')
			.limit(5000);
		if (from) qb.andWhere('c.time >= :from', { from });
		if (to) qb.andWhere('c.time < :to', { to });
		const rows = await qb.getMany();
		return { ok: true, data: rows };
	}

	@Post('bulk-upsert')
	async bulkUpsert(
		@Body() dto: CandleBulkUpsertDto,
		@Headers('Idempotency-Key') idem?: string,
	) {
		await this.candleService.bulkUpsert(dto.items, idem ?? dto.idempotencyKey);
		return { ok: true, count: dto.items.length }
	}
}