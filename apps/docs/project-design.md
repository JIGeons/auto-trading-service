📘 프로젝트 기획 & 설계서

#### 프로젝트명: auto-trading-service (Crypto → Equity 확장 가능)

#### 목표:
- 단기 자동매매(코인 → 주식 확장)
- DDD/헥사고날 아키텍처 기반의 NestJS 서버
- 실거래 엔진은 Python 기반 전략 서비스로 분리
- 대시보드(NestJS + React/Next.js)에서 거래/포지션/리스크/리포트 조회

## 1. 전체 아키텍처

```mermaid

flowchart LR
  subgraph User["Trader / Analyst"]
    UI[Dashboard (Next.js)]
  end

  subgraph NestAPI["NestJS API (DDD + CQRS)"]
    I[Instrument Module]
    T[Trading Module]
    M[MarketData Module]
    R[Reporting Module]
  end

  subgraph DB["DB Layer (Postgres 16 + TimescaleDB)"]
    Instruments[(Instruments)]
    Orders[(Orders)]
    Positions[(Positions)]
    Candles[(Candles Hypertable)]
    Outbox[(Outbox Events)]
  end

  subgraph PyEngine["Python Strategy Engine"]
    Strategy[Strategies (Donchian/ATR, MeanReversion...)]
    Executor[Execution Loop (FastAPI/Worker)]
  end

  UI <--> NestAPI
  NestAPI <--> DB
  NestAPI <--> PyEngine
```

## 2. 기술 스택
- Backend (플랫폼): NestJS 10, TypeORM, CQRS, BullMQ, Redis
- Database: PostgreSQL 16 + TimescaleDB (Hypertable + Continuous Aggregate)
- Strategy Engine: Python (Pandas, backtesting.py, ccxt/pyupbit, FastAPI)
- Frontend: Next.js + Tailwind + shadcn/ui
- Infra: Docker Compose, Nginx (API Gateway), Redis (Queue/Cache)

## 3. 도메인 설계 (DDD 바운디드 컨텍스트)
### InstrumentCatalog
- Instrument(id, symbol, exchange, type, tickSize, lotSize)
- 지원 자산군: CRYPTO, EQUITY

### MarketData
- 캔들/틱/오더북 저장
- Timescale Hypertable (candles)
- Continuous Aggregate 뷰 → 1m, 5m, 15m, 1h 자동 생성

### Trading
- 엔티티: Order, Execution, Position, Account
- 도메인 서비스: RiskPolicy (일일 손실컷, 맥스 포지션)
- 포트/어댑터: ExchangePort → Python Engine, Upbit/Binance/EquityBroker

### Reporting
- Equity Curve, PnL, Win/Loss, Payoff Ratio
- Continuous Aggregate / Materialized View 기반


## 4. 데이터베이스 설계
### 주요 테이블
#### - instruments
- `id`, `symbol`, `exchange`, `type`, `tickSize`, `lotSize`

#### - orders
- `id`, `instrumentId`, `side`, `status`, `requestedSize`, `filledSize`, `createdAt`

#### - positions
- `id`, `instrumentId`, `size`, `entryPrice`, `stop`, `openedAt`

#### - candles (Hypertable)
- `time`, `instrumentId`, `tf`, `open`, `high`, `low`, `close`, `volume`

#### - outbox
- `id`, `topic`, `payload`, `createdAt`, `published`

### Timescale 설정
- `create_hypertable('candles', 'time', chunk_time_interval => interval '1 day')`

- Continuous Aggregates: `candles_5m`, `candles_15m`, ...

- 정책: `add_retention_policy('candles', interval '120 days')`

## 5. 모듈 구조 (NestJS)
```
apps/api/src/modules
├─ instrument/       # 종목 관리
├─ trading/          # 주문/포지션/리스크
├─ market-data/      # 캔들/틱 조회
└─ reporting/        # 리포트 API
```

### CQRS 흐름
- **Command**: PlaceOrder → RiskPolicy → ExchangePort 호출 → Outbox 이벤트 발행

- **Query**: GetEquityCurve → Continuous Aggregate 뷰 조회

## 6. Python 전략 엔진

- **전략 모듈**: Donchian Breakout + ATR Stop, Mean Reversion, Volatility Filter

- **실행 모드**
	- Backtest: backtesting.py/vectorbt
	- Paper Trading: pyupbit/ccxt + SQLite
	- Live: REST/gRPC → 거래소 API (Upbit/Binance)

- **FastAPI API**
	- `/order/place`
	- `/order/status`
	- `/positions`

## 7. 대시보드 (Next.js)
### 주요 화면

1. **Overview**
	- Equity Curve, Daily PnL, Win/Loss

2. **Market Data**
	- 캔들 차트 (1m, 5m, 15m, 1h)
	- 거래량, 지표 (ATR, RSI 등)

3. **Trading**
	- 오픈 포지션, 주문 내역
	- 실시간 체결 현황

4. **Reporting**
	- 전략별 성과 비교
	- 주간/월간 리포트 다운로드

## 8. 개발 워크플로우

### 1. 프로젝트 부트스트랩
- `nest new auto-trading-service`
- PostgreSQL + TimescaleDB 컨테이너 실행

### 2. DB 마이그레이션
- TypeORM + 마이그레이션으로 테이블/Hypertable 생성

### 3. 모듈 개발
- `Instrument` → `MarketData` → `Trading` → `Reporting`

### 4. 전략 엔진 연동
- ExchangePort → REST/gRPC → Python FastAPI

### 5. 대시보드 개발
- Reporting API 바인딩, 시각화

### 6. 테스트
- 단위/통합/e2e
- Paper Trading 시뮬레이션

## 9. 향후 확장
- 주식/ETF 지원 (NASDAQ, KRX API 연동)

- 고빈도(틱) 저장/리포팅: ClickHouse 보조

- 사용자별 계좌/권한 → SaaS 형태로 확장

- 실시간 알림: Slack/Telegram Webhook