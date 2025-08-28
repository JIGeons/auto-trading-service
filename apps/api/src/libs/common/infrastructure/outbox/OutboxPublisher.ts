import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxEntity } from './OutboxEntity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OutboxPublisher {
  constructor(
    @InjectRepository(OutboxEntity)
    private readonly outboxRepository: Repository<OutboxEntity>,
  ) {}

  async publish(topic: string, payload: object): Promise<void> {
    const outboxEntry = new OutboxEntity();
    outboxEntry.id = uuidv4();
    outboxEntry.topic = topic;
    outboxEntry.payload = payload;
    outboxEntry.createdAt = new Date();
    outboxEntry.published = false;

    await this.outboxRepository.save(outboxEntry);
    // TODO: 실제 메시지 큐 (예: BullMQ)로 발행하는 로직 추가
    console.log(`Outbox event saved: ${topic}, ${JSON.stringify(payload)}`);
  }
}
