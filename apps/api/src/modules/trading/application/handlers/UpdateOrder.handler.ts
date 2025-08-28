import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrderCommand } from '../commands/UpdateOrder.command';
import type { OrderRepositoryPort } from '../../domain/repositories/order-repository.port';
import { OrderId } from '../../domain/value-objects/order-id';
import { Order } from '../../domain/entities/order';
import { Inject } from '@nestjs/common';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort
  ) {}

  async execute(command: UpdateOrderCommand): Promise<Order> {
    const orderId = new OrderId(command.orderId);
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (command.status) {
      // Simplified status update logic
      if (command.status === 'CANCELED') {
        order.cancel();
      } else if (command.status === 'REJECTED') {
        order.reject();
      } else if (command.status === 'FILLED' && command.filledSize !== undefined) {
        order.fill(command.filledSize);
      } else if (command.status === 'PARTIALLY_FILLED' && command.filledSize !== undefined) {
        order.fill(command.filledSize);
      }
    }

    // TODO: More sophisticated update logic based on filledSize, etc.

    await this.orderRepository.save(order);
    return order;
  }
}
