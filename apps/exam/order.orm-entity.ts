import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import type { OrderSide, OrderStatus } from '../api/src/modules/trading/domain/entities/order';

@Entity('orders')
@Index(['accountId', 'status'])
@Index(['instrumentId', 'status'])
export class OrderOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'uuid' })
  instrumentId: string;

  @Column({ type: 'enum', enum: ['BUY', 'SELL'] })
  side: OrderSide;

  @Column({ type: 'double precision' })
  requestedSize: number;

  @Column({ type: 'double precision', default: 0 })
  filledSize: number;

  @Column({ type: 'enum', enum: ['PENDING', 'FILLED', 'PARTIALLY_FILLED', 'CANCELED', 'REJECTED'] })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
