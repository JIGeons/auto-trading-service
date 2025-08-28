import { OrderStatus } from '../../domain/entities/order';

export class UpdateOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly status?: OrderStatus,
    public readonly filledSize?: number,
  ) {}
}
