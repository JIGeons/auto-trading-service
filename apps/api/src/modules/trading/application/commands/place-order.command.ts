export class PlaceOrderCommand {
  constructor(
    public readonly instrumentId: string,
    public readonly side: 'BUY'|'SELL',
    public readonly size: number,
    public readonly idempotencyKey: string,
  ) {}
}


