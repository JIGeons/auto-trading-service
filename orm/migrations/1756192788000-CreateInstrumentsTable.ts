import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInstrumentsTable1756192788000 implements MigrationInterface {
    name = 'CreateInstrumentsTable1756192788000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."instruments_type_enum" AS ENUM('CRYPTO', 'EQUITY')`);
        await queryRunner.query(`CREATE TABLE "instruments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "symbol" character varying NOT NULL, "exchange" character varying NOT NULL, "type" "public"."instruments_type_enum" NOT NULL, "tickSize" double precision NOT NULL DEFAULT '0', "lotSize" double precision NOT NULL DEFAULT '0', CONSTRAINT "PK_44d772c3199b38559c5fb666eb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a0b903c2a010cf084dfab3151f" ON "instruments" ("exchange", "symbol") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a0b903c2a010cf084dfab3151f"`);
        await queryRunner.query(`DROP TABLE "instruments"`);
        await queryRunner.query(`DROP TYPE "public"."instruments_type_enum"`);
    }

}
