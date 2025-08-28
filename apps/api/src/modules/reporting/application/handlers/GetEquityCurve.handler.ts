import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEquityCurveQuery } from '../queries/GetEquityCurve.query';
import { EquityPoint } from '../dto/EquityPoint';

// Interfaces
import type { AccountRepositoryPort } from '@api/modules/trading/domain/repositories/account-repository.port';
import type { OrderRepositoryPort } from '@api/modules/trading/domain/repositories/order-repository.port';
import type { PositionRepositoryPort } from '@api/modules/trading/domain/repositories/position-repository.port';

import { AccountId } from '@api/modules/trading/domain/value-objects/account-id';
import { Inject } from '@nestjs/common';

@QueryHandler(GetEquityCurveQuery)
export class GetEquityCurveHandler implements IQueryHandler<GetEquityCurveQuery> {
  constructor(
    @Inject('AccountRepositoryPort')
    private readonly accountRepository: AccountRepositoryPort,
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
    @Inject('PositionRepositoryPort')
    private readonly positionRepository: PositionRepositoryPort,
  ) {}

  async execute(query: GetEquityCurveQuery): Promise<EquityPoint[]> {
    const accountId = new AccountId(query.accountId);
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    // TODO: 실제 Equity Curve 계산 로직 구현
    // 이 부분은 복잡하며, 주문, 체결, 포지션 PnL, 입출금 등을 종합적으로 고려해야 합니다.
    // 초기 구현에서는 간단한 더미 데이터를 반환하거나, 계좌 잔고 변화만 반영할 수 있습니다.

    const equityCurve: EquityPoint[] = [];
    let currentEquity = account.balance; // 시작 잔고

    // 예시: 매일 잔고가 0.1%씩 증가하는 더미 데이터
    for (let d = new Date(query.from); d <= query.to; d.setDate(d.getDate() + 1)) {
      currentEquity *= 1.001;
      equityCurve.push({ date: new Date(d), equity: currentEquity });
    }

    return equityCurve;
  }
}
