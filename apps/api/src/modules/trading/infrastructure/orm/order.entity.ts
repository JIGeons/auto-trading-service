import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import type { OrderSide } from '../../domain/entities/order';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn('uuid') 
  id!: string;

  @Column('uuid') 
  instrumentId!: string;

  @Column({ type: 'varchar' }) 
  side!: OrderSide;

  @Column('decimal', { precision: 28, scale: 10 }) 
  requestedSize!: string;

  @Column('decimal', { precision: 28, scale: 10, default: '0' }) 
  filledSize!: string;

  @Column({ type: 'varchar', default: 'NEW' }) 
  status!: string;

  @Column({ type: 'varchar', nullable: true }) 
  idempotencyKey?: string;

  @CreateDateColumn() 
  createdAt!: Date;

  @UpdateDateColumn() 
  updatedAt!: Date;
}