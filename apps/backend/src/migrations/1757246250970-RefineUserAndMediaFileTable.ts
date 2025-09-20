import { MigrationInterface, QueryRunner } from "typeorm";

export class RefineUserAndMediaFileTable1757246250970 implements MigrationInterface {
    name = 'RefineUserAndMediaFileTable1757246250970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media_file" DROP CONSTRAINT "FK_15d1b8462301253c6aaa5d39622"`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "uploaderId" uuid`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "originalName"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "originalName" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "mimeType" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "url" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "publicId" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" TYPE text`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" TYPE text`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" TYPE text`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "displayName" TYPE text`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD CONSTRAINT "FK_b894aa125397989c31b8bf30737" FOREIGN KEY ("uploaderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media_file" DROP CONSTRAINT "FK_b894aa125397989c31b8bf30737"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "displayName" TYPE character varying(100)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" TYPE character varying(500)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" TYPE character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" TYPE character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "publicId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "url" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "mimeType" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "originalName"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "originalName" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "uploaderId"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD CONSTRAINT "FK_15d1b8462301253c6aaa5d39622" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
