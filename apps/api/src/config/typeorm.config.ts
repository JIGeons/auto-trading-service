import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from '@api/config/env';

/* Modules */
// import { InstrumentOrmEntity } from '../modules/instrument/infrastructure/orm/Instrument.orm-entity';
// import { OrderOrmEntity } from '../modules/trading/infrastructure/orm/Order.orm-entity';
// import { PositionOrmEntity } from '../modules/trading/infrastructure/orm/Position.orm-entity';
// import { CandleOrmEntity } from '../modules/market-data/infrastructure/orm/Candle.orm-entity';
// import { OutboxEntity } from '../libs/common/infrastructure/outbox/OutboxEntity';

export const typeormConfig = (): TypeOrmModuleOptions => ({
	type: 'postgres',
	host: env.DB.host,
	port: env.DB.port,
	username: env.DB.user,
	password: env.DB.pass,
	database: env.DB.name,
	entities: [],	// Entity 추가
	migrations: [__dirname + '/../../../orm/migrations/*.{ts,js}'],
	synchronize: false,
	logging: false,
});