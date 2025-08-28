export abstract class ExchangePort {
  abstract placeOrder(params: {
    instrumentId: string; side: 'BUY'|'SELL'; size: number; idempotencyKey: string;
  }): Promise<{ ok: boolean; orderId?: string; error?: string }>

  abstract cancelOrder(params: { brokerOrderId: string }): Promise<{ ok: boolean; error?: string }>
}


