import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableUuidOssp1750000000000 implements MigrationInterface {
  name = 'EnableUuidOssp1750000000000'
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  }
  public async down(_q: QueryRunner): Promise<void> {
    // no-op: keep extension enabled
  }
}


