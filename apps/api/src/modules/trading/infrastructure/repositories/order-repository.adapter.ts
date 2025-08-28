import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepositoryPort } from '../../domain/repositories/order-repository.port';
import { Order, OrderStatus } from '../../domain/entities/order';
import { OrderOrmEntity } from '../../../../../../exam/order.orm-entity';
import { OrderId } from '../../domain/value-objects/order-id';
import { AccountId } from '../../domain/value-objects/account-id';
import { InstrumentId } from '../../../instrument/domain/value-objects/InstrumentId';

@Injectable()
export class OrderRepositoryAdapter implements OrderRepositoryPort {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly orderRepository: Repository<OrderOrmEntity>,
  ) {}

  async save(order: Order): Promise<void> {
    const ormEntity = this.toOrmEntity(order);
    await this.orderRepository.save(ormEntity);
  }

  async findById(orderId: OrderId): Promise<Order | null> {
    const ormEntity = await this.orderRepository.findOne({
      where: { id: orderId.value },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByAccountId(accountId: AccountId): Promise<Order[]> {
    const ormEntities = await this.orderRepository.find({
      where: { accountId: accountId.value },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map(this.toDomainEntity);
  }

  async findByInstrumentIdAndStatus(
    instrumentId: InstrumentId,
    status: OrderStatus,
  ): Promise<Order[]> {
    const ormEntities = await this.orderRepository.find({
      where: { instrumentId: instrumentId.value, status },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map(this.toDomainEntity);
  }

  private toOrmEntity(order: Order): OrderOrmEntity {
    const ormEntity = new OrderOrmEntity();
    ormEntity.id = order.id.value;
    ormEntity.accountId = order.accountId.value;
    ormEntity.instrumentId = order.instrumentId.value;
    ormEntity.side = order.side;
    ormEntity.requestedSize = order.requestedSize;
    ormEntity.filledSize = order.filledSize;
    ormEntity.status = order.status;
    ormEntity.createdAt = order.createdAt;
    ormEntity.updatedAt = order.updatedAt;
    return ormEntity;
  }

  private toDomainEntity(ormEntity: OrderOrmEntity): Order {
    return Order.fromPersistence(
      new OrderId(ormEntity.id),
      new AccountId(ormEntity.accountId),
      new InstrumentId(ormEntity.instrumentId),
      ormEntity.side,
      ormEntity.requestedSize,
      ormEntity.filledSize,
      ormEntity.status,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }
}
