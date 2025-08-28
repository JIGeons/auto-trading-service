import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandleEntity } from '../orm/candle.entity';


@Controller({ version: '1', path: '/market-data' })
export class CandlesController {
	constructor(
		@InjectRepository(CandleEntity) private readonly repo: Repository<CandleEntity>
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
}