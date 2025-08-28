import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import { InstrumentType } from '../../application/dto/RegisterInstrument.dto';

@Entity('instruments')
@Index(['exchange', 'symbol'], { unique: true })
export class InstrumentOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar' })
  symbol: string;

  @Column({ type: 'varchar' })
  exchange: string;

  @Column({ type: 'enum', enum: InstrumentType })
  type: InstrumentType;

  @Column({ type: 'double precision', default: 0 })
  tickSize: number;

  @Column({ type: 'double precision', default: 0 })
  lotSize: number;
}
