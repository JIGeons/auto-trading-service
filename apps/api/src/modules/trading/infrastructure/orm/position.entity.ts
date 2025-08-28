import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('positions')
export class PositionEntity {
  @PrimaryColumn('uuid') 
  id!: string;

  @PrimaryColumn('uuid') 
  accountId!: string;

  @PrimaryColumn('uuid') 
  instrumentId!: string;

  @Column('decimal', { precision: 28, scale: 10 }) 
  size!: string;

  @Column('decimal', { precision: 28, scale: 2 }) 
  entryPrice!: string;

  @Column('decimal', { precision: 28, scale: 2, nullable: true }) 
  stop?: string;

  @CreateDateColumn() 
  openedAt!: Date;

  @CreateDateColumn() 
  createdAt!: Date;

  @CreateDateColumn() 
  updatedAt!: Date;
}


