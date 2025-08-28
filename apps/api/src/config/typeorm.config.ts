import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import env from './env.config';

/* Modules */
import { InstrumentOrmEntity } from '../modules/instrument/infrastructure/orm/Instrument.orm-entity';
import { OrderOrmEntity } from '../modules/trading/infrastructure/orm/order.entity';
import { PositionEntity } from '../modules/trading/infrastructure/orm/position.entity';
import { AccountOrmEntity } from '../modules/trading/infrastructure/orm/account.orm-entity';
import { CandleEntity } from '../modules/market-data/infrastructure/orm/candle.entity';
import { OutboxEntity } from '../libs/common/infrastructure/outbox/OutboxEntity';
import { DataSourceOptions } from 'typeorm';

export default() => {
	const cfg = env();
	const opts: DataSourceOptions = {
		type: 'postgres',
		host: cfg.DB.host,
		port: cfg.DB.port,
		username: cfg.DB.user,
		password: cfg.DB.pass,
		database: cfg.DB.name,
		ssl: cfg.DB.ssl,
		autoLoadEntities: true,
		synchronize: false,
		logging: process.env.NODE_ENV === 'development',
	};
	return opts;
};