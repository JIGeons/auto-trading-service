import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('candles')
@Index(['time', 'instrumentId', 'tf'], { unique: true })
export class CandleOrmEntity {
  @PrimaryColumn({ type: 'timestamp with time zone' })
  time!: Date;

  @PrimaryColumn({ type: 'uuid' })
  instrumentId!: string;

  @PrimaryColumn({ type: 'varchar' })
  tf: string; // Timeframe, e.g., '1m', '5m', '1h'

  @Column('numeric', { precision: 20, scale: 2 })
  open!: string;

  @Column('numeric', { precision: 20, scale: 2 })
  high!: string;

  @Column('numeric', { precision: 20, scale: 2 })
  low!: string;

  @Column('numeric', { precision: 20, scale: 2 })
  close!: string;

  @Column('numeric', { precision: 30, scale: 10 })
  volume!: string;
}
