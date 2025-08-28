import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('executions')
export class ExecutionEntity {
  @PrimaryGeneratedColumn('uuid') 
  id!: string;

  @Column('uuid') 
  orderId!: string;

  @Column('decimal', { precision: 28, scale: 10 }) 
  qty!: string;

  @Column('decimal', { precision: 28, scale: 2 }) 
  price!: string;

  @Column('decimal', { precision: 28, scale: 2, default: '0' }) 
  fee!: string;

  @CreateDateColumn() 
  ts!: Date;
}


