import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('outbox')
export class OutboxEntity {
	@PrimaryGeneratedColumn() 
	id!: number;

	@Column() 
	topic!: string;

	@Column('text') 
	payload!: string;

	@CreateDateColumn() 
	createdAt!: Date;

	@Column({ default: false }) 
	published!: boolean;
}