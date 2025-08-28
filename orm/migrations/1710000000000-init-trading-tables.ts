import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTradingTables1710000000000 implements MigrationInterface {
  name = 'InitTradingTables1710000000000'
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      create table if not exists orders(
        id uuid primary key,
        instrument_id uuid not null,
        side varchar not null,
        requested_size numeric(28,10) not null,
        filled_size numeric(28,10) not null default 0,
        status varchar not null default 'NEW',
        idempotency_key varchar,
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );
      create table if not exists positions(
        id uuid primary key,
        instrument_id uuid not null,
        size numeric(28,10) not null,
        entry_price numeric(28,2) not null,
        stop numeric(28,2),
        opened_at timestamptz default now()
      );
      create table if not exists executions(
        id uuid primary key default gen_random_uuid(),
        order_id uuid not null references orders(id),
        qty numeric(28,10) not null,
        price numeric(28,2) not null,
        fee numeric(28,2) not null default 0,
        ts timestamptz default now()
      );
      create index if not exists idx_orders_instr_status on orders(instrument_id, status);
    `);
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query(`drop table if exists executions; drop table if exists positions; drop table if exists orders;`);
  }
}


