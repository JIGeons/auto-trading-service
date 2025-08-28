import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('outbox')
export class OutboxEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  topic: string;

  @Column({ type: 'jsonb' })
  payload: object;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  published: boolean;
}
