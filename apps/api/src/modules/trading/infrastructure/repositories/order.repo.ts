import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../orm/order.entity';
import { Order } from '../../domain/entities/order';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>
  ) {}

  async save(o: Order) {
    await this.orderRepository.save({
      id: o.id,
      instrumentId: o.instrumentId,
      side: o.side,
      requestedSize: o.requestedSize.toString(),
      filledSize: o.filledSize.toString(),
      status: o.status,
      // idempotencyKey: o.idempotencyKey,
    });
  }
}


