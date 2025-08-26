# 🧭 Project Conventions (for README)

> Auto Trading Service — NestJS + TypeORM + PostgreSQL 16 + TimescaleDB
> 
> 
> 도메인 단위(DDD/헥사고날) + CQRS, 코인→주식 확장 가능
> 



## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).

```
auto-trading-service/
├─ apps/
│  └─ api/
│     └─ src/
│        ├─ main.ts
│        ├─ app.module.ts
│        ├─ config/            # env, typeorm 설정
│        ├─ libs/
│        │  └─ common/         # 공통 유틸, outbox
│        └─ modules/
│           ├─ instrument/     # 종목
│           ├─ market-data/    # 캔들/틱
│           ├─ trading/        # 주문/포지션
│           └─ reporting/      # 리포트
├─ orm/                         # TypeORM DataSource & migrations
├─ .env.example
└─ package.json
```

원칙:

- **module 단위**로 `domain / application / infrastructure` 디렉터리 구분(도입 단계에서는 최소화 가능).
- **ORM 엔티티는 infrastructure**, **도메인 엔티티/값객체는 domain**에 둔다.
- **CQRS**: `application/commands|queries` 와 `application/handlers` 분리.

## Support

Nest is an MIT licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).

```
auto-trading-service/
├─ apps/
│  └─ api/
│     └─ src/
│        ├─ main.ts
│        ├─ app.module.ts
│        ├─ config/            # env, typeorm 설정
│        ├─ libs/
│        │  └─ common/         # 공통 유틸, outbox
│        └─ modules/
│           ├─ instrument/     # 종목
│           ├─ market-data/    # 캔들/틱
│           ├─ trading/        # 주문/포지션
│           └─ reporting/      # 리포트
├─ orm/                         # TypeORM DataSource & migrations
├─ .env.example
└─ package.json
```

원칙:

- **module 단위**로 `domain / application / infrastructure` 디렉터리 구분(도입 단계에서는 최소화 가능).
- **ORM 엔티티는 infrastructure**, **도메인 엔티티/값객체는 domain**에 둔다.
- **CQRS**: `application/commands|queries` 와 `application/handlers` 분리.



## 2) 브랜치 & 릴리즈

- 전략: **Trunk-based** (+ 단기 feature 브랜치)
    - `main`: 항상 배포 가능한 상태
    - `feat/<topic>`: 기능 개발 (예: `feat/market-data-reader`)
    - `fix/<topic>`: 버그 수정
    - `chore/<topic>`: 설정/문서/빌드
- PR 머지 전략: **squash-merge** 기본 (히스토리 간결화)
- 태그/버전: **Semantic Versioning**
    - `MAJOR.MINOR.PATCH` (ex. `v0.3.2`)
    - API 변경(깨짐) = MAJOR, 기능 추가 = MINOR, 버그/문서 = PATCH



## 3) 커밋 메시지 (Conventional Commits)

```
<type>(scope): <subject>

body (optional)
BREAKING CHANGE: (optional)
```

**type**:

- `feat`: 기능
- `fix`: 버그
- `docs`: 문서/README
- `chore`: 설정/빌드/의존성
- `refactor`: 리팩터
- `test`: 테스트
- `perf`: 성능
- `ci`: CI/CD

예시:

```
feat(trading): add PlaceOrder command & handler
fix(market-data): handle empty candle gap on 1m stream
docs(readme): add Timescale continuous aggregate notes
```



## 4) 코드 스타일 (TypeScript/NestJS)

- **ESLint + Prettier** 준수
- 파일명: `kebab-case` (예: `trading.controller.ts`)
- 클래스/인터페이스: `PascalCase`
- 함수/변수: `camelCase`
- DTO는 **접미사 `Dto`**, 명령/쿼리는 **접미사 `Command` / `Query`**
- 엔티티(도메인)는 불변성 선호, 상태변경은 **도메인 메서드**로 캡슐화

예:

```tsx
// application/commands/place-order.command.ts
export class PlaceOrderCommand {
  constructor(
    public readonly instrumentId: string,
    public readonly side: 'BUY'|'SELL',
    public readonly size: number,
  ) {}
}
```



## 5) DDD / 모듈 규칙

- **Domain**
    - `entities/`, `value-objects/`, `policies/`, `events/`, `repositories/*.port.ts`
    - 외부 의존 금지(프레임워크, ORM X)
- **Application**
    - `commands/queries`, `handlers`, `dto/`
    - **비즈니스 오케스트레이션** 담당 (트랜잭션 경계 포함 가능)
- **Infrastructure**
    - `controllers/`(Nest), `orm/`(TypeORM 엔티티), `repositories/*.adapter.ts`, `adapters/*`(외부 API)

**Port/Adapter**:

도메인 포트(interface) ↔ 어댑터(구현체)를 DI로 연결. 예: `ExchangePort` ↔ `UpbitAdapter`.



## 6) DTO & Validation

- 입력 DTO에 **class-validator** 적용, 컨트롤러 단에서 검증
- DTO는 **domain 객체로 직접 전달 금지**. Application에서 매핑/정제

예:

```tsx
export class RegisterInstrumentDto {
  @IsString() symbol!: string;
  @IsString() exchange!: string;
  @IsEnum(InstrumentType) type!: InstrumentType;
  @IsNumber() @IsOptional() tickSize?: number;
}
```



## 7) 에러 처리 & 응답 규약

- 컨트롤러는 **HTTP 상태 코드** 명확히 반환
- 도메인/애플리케이션 오류는 **의미 있는 코드/메시지**로 맵핑
- 기본 응답 포맷(권장):

```json
{ "ok": true, "data": { ... } }
{ "ok": false, "error": { "code": "RISK_LIMIT", "message": "Daily loss limit exceeded" } }
```



## 8) 로깅 & 관측

- Nest Logger 사용, **context** 전달 (`this.logger.log('msg', {ctx})`)
- 최소: 요청 ID, 사용자/계정 ID, command 이름, 처리 시간(ms)
- 운영 시: OpenTelemetry/Prometheus 연동 고려



## 9) 환경 변수

`.env.example` 유지 — 반드시 **설정/비밀 분리**

```
NODE_ENV=development
PORT=3100
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=auto-trading
DB_SSL=false
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```



## 10) 데이터베이스 (PostgreSQL + TimescaleDB)

- 마이그레이션은 **TypeORM CLI**로 관리 (`synchronize=false`)
- **Hypertable**/**Continuous Aggregate**/**Retention/Compression** 등 Timescale 관련 DDL은 **마이그레이션에 raw SQL**로 포함
- 키 정책:
    - PK: `uuid` (애플리케이션에서 생성 or `pgcrypto`)
    - `candles` PK: `(time, instrumentId, tf)`
- 인덱스는 **조회 경로 기준**으로 추가 (예: `orders(instrumentId, status)`)



## 11) API 규약

- **Prefix**: `/api`
- **Versioning**: URL 버저닝 권장 `/api/v1/...`
- **리소스 설계**(예):
    - `POST /instrument/register`
    - `GET /market-data/candles?instrumentId=&tf=&from=&to=`
    - `POST /trading/place-order`
    - `GET /reporting/equity?accountId=&from=&to=`
- **페이징**: `?page=1&limit=50` (응답에 `total`, `hasNext` 포함)
- **Idempotency**(주문 등 중요 엔드포인트): `Idempotency-Key` 헤더 지원 권장
- **Rate Limit**: 글로벌/토큰별 제한 (프록시/Nginx/Redis)



## 12) 인증 & 권한

- 기본: **JWT** (`Authorization: Bearer <token>`)
- 롤: `admin`, `analyst`, `trader`
- 엔드포인트별 Role 가드 + 정책(예: 주문 권한은 `trader` 이상)



## 13) 테스트

- **단위**: 핸들러/리포지토리/서비스 단위로 빠르게
- **통합**: in-memory DB 대신 **실제 Postgres (Docker)** 권장
- **e2e**: Nest 앱 부팅 → 실제 HTTP 호출 → 상태/DB 검증
- 최소 커버리지 목표: **statements 80%**



## 14) CI/CD (권장 파이프라인)

- **CI**
    - install → lint → test(unit+e2e) → build
    - 마이그레이션 dry-run
- **CD**
    - 태그(`v*`) 푸시 시 이미지 빌드/배포
    - DB 마이그레이션 실행 단계 분리(승인 필요)



## 15) 린트 & 포맷터

- ESLint + Prettier 설정 고정
- pre-commit 훅: `lint-staged`로 변경 파일만 포맷/린트
- CI에서 **lint 오류 시 실패**



## 16) PR 규칙 & 리뷰 체크리스트

**PR 템플릿 요지**

- 목적 (Why)
- 변경 사항 (What)
- 테스트 (How)
- 스크린샷/쿼리 플랜(해당 시)
- 체크리스트
    - [ ]  마이그레이션 포함/검증
    - [ ]  DTO/Validation 추가
    - [ ]  로그/예외 메시지 명확
    - [ ]  성능 영향 검토(인덱스/쿼리)
    - [ ]  문서/README 갱신

**리뷰 팁**

- 비즈니스 규칙은 **Application/Domain**에 있는가?
- Infra 의존이 **Domain**에 새지 않는가?
- CQRS 분리 준수 여부
- N+1, 필요 인덱스 누락 여부
- 타임존/정렬/경계 처리(포함/제외) 명확성



## 17) 보안/비밀 관리

- 비밀은 `.env` **커밋 금지**
- 프로덕션은 **Secret Manager** 사용(예: AWS/GCP)
- 로그에 **민감 정보 노출 금지**
- 의존성 정기 업데이트(보안 이슈 트래킹)



## 18) 성능/스케일 지침

- **읽기 부하**: Timescale continuous aggregates + 캐시(REDIS)
- **쓰기 부하**: 배치/큐(BullMQ)로 흡수
- **비동기 이벤트(Outbox)**: 트랜잭션 커밋 후 발행
- 대량 조회 API는 **페이지 사이즈 제한**(예: max 5000)



## 19) 국제화/통화/타임존

- 서버 기본 타임존: **UTC** 저장, 클라이언트에서 변환
- 통화/숫자 포맷은 **프런트에서 처리**
- API 쿼리 파라미터 `from`, `to`는 **ISO8601**(UTC) 사용



## 20) Python 전략 엔진 연동 규약 (요약)

- **ExchangePort**를 통해 호출:
    - Nest → (REST/gRPC/큐) → Python(FastAPI/Worker)
- 공통 스키마:

```json
POST /engine/order/place
{
  "instrumentId": "uuid",
  "side": "BUY|SELL",
  "size": 0.01,
  "idempotencyKey": "uuid"
}
```

응답:

```json
{ "ok": true, "orderId": "broker-123" }
```

- 실패 시 표준 에러 코드: `RISK_LIMIT`, `REJECTED_BY_BROKER`, `INSUFFICIENT_FUNDS`, `RATE_LIMITED`, `NETWORK_ERROR`



## 21) 문서화

- **README**: 빠른 시작, 환경설정, 마이그레이션, 예제 호출
- **/docs**: 아키텍처 개요, ERD, 시퀀스 다이어그램, API 스펙(OpenAPI)
- 변경 시 **CHANGELOG** 업데이트 (Keep a Changelog 형식 권장)

## 22) 디버깅 (Docker & VS Code)

Docker 환경에서 `api` 애플리케이션을 VS Code로 디버깅하려면 다음 단계를 따르세요:

### 1. `docker-compose.yml` 업데이트 (Gemini CLI가 이미 완료)

`docker-compose.yml`에 디버그 포트가 노출되고 `start:debug` 명령이 포함된 `api` 서비스가 있는지 확인하세요. 이 설정은 이미 완료되었습니다:

```yaml
services:
  api:
    # ... 기타 설정 ...
    ports:
      - '${API_PORT:-3100}:3100'
      - '${API_DEBUG_PORT:-9229}:9229' # 디버그 포트
    command: npm run start:debug api # 디버그 모드로 시작
    # ... 기타 설정 ...
```

### 2. `.vscode/launch.json` 생성/업데이트

프로젝트 루트에 `.vscode` 폴더가 없으면 생성하고, 그 안에 `launch.json` 파일을 다음 내용으로 만드세요:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to API (Docker)",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "restart": true,
      "protocol": "inspector",
      "localRoot": "${workspaceFolder}/apps/api",
      "remoteRoot": "/app/apps/api",
      "skipFiles": [
        "<node_internals>/**"
      ]
    }
  ]
}
```

### 3. Docker 컨테이너 시작

프로젝트 루트 디렉토리에서 Docker 컨테이너를 실행하세요:

```bash
npm run docker:start
# 또는
docker-compose up --build
```

이렇게 하면 `api` 서비스가 디버그 모드로 시작되고, 9229 포트에서 디버거 연결을 기다립니다.

### 4. VS Code에서 디버거 연결

1.  VS Code를 엽니다.
2.  **실행 및 디버그** 뷰(왼쪽 사이드바의 벌레 아이콘)로 이동합니다.
3.  상단 드롭다운 메뉴에서 **"Attach to API (Docker)"**를 선택합니다.
4.  **녹색 재생 버튼**을 클릭하여 디버거를 연결합니다.

이제 TypeScript 파일(예: `apps/api/src`)에 중단점을 설정하고 애플리케이션을 디버깅할 수 있습니다.

### 마지막 한 줄

**단순하고 일관된 규칙**이 팀 속도를 만듭니다. 위 컨벤션을 기본으로 두고, 실제 운영 중 생기는 예외는 **문서에 즉시 반영**해 주세요.