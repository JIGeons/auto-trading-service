import { Injectable } from '@nestjs/common';
import { ExchangePort } from '../../domain/ports/exchange.port';

@Injectable()
export class UpbitAdapter extends ExchangePort {
  private readonly engineBase = process.env.ENGINE_BASE_URL || 'http://localhost:8080';

  async placeOrder(request: { instrumentId: string; side: 'BUY'|'SELL'; size: number; idempotencyKey: string; }): Promise<{ ok: boolean; orderId?: string; error?: string; }> {
    try {
      const res = await fetch(`${this.engineBase}/order/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': request.idempotencyKey,
        },
        body: JSON.stringify({
          instrumentId: request.instrumentId,
          side: request.side,
          size: request.size,
        }),
      });

      const json = (await res.json()) as { ok?: boolean; orderId?: string; error?: string };

      if (json && json.ok) return { ok: true, orderId: json.orderId };
      return { ok: false, error: json?.error ?? 'REJECTED_BY_BROKER' };
    } catch (error) {
      return { ok: false, error: 'NETWORK_ERROR' };
    }
  }

  async cancelOrder(params: { brokerOrderId: string }): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch(`${this.engineBase}/order/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      return json.ok ? { ok: true } : { ok: false, error: json.error };
    } catch (e) {
      return { ok: false, error: 'NETWORK_ERROR' };
    }
  }
}


