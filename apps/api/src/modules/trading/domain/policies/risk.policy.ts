import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskPolicy {
  private readonly MAX_RISK_BPS = 100; // 1% per trade
  private readonly DAILY_LOSS_CAP_BPS = 300; // 3% daily

  // TODO: inject account/equity service to compute actual caps
  ensurePlaceAllowed(_instrumentId: string, _size: number) {
    // placeholder: extend with equity lookup & exposure checks
    return { ok: true } as const;
  }
}


