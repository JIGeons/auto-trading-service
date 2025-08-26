import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';


export enum InstrumentType { CRYPTO='CRYPTO', EQUITY='EQUITY' }


@Entity('instruments')
@Index(['exchange','symbol'], { unique: true })
export class InstrumentOrmEntity {
	@PrimaryGeneratedColumn('uuid') 
	id!: string;

	@Column() 
	symbol!: string; // KRW-BTC, AAPL

	@Column() 
	exchange!: string; // UPBIT, BINANCE, NASDAQ

	@Column({ type: 'enum', enum: InstrumentType }) 
	type!: InstrumentType;

	@Column({ type: 'double precision', default: 0 }) 
	tickSize!: number;

	@Column({ type: 'double precision', default: 0 }) 
	lotSize!: number;
}