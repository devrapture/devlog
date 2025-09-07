import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMediaFileTable1757206375776 implements MigrationInterface {
    name = 'CreateMediaFileTable1757206375776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" text`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "displayName"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "displayName" text`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "originalName"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "originalName" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "mimeType" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "url" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "publicId" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "originalName"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "originalName" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "mimeType" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "url" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "publicId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "displayName"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "displayName" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "displayName"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "displayName" text`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" text`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "publicId" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "url" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "mimeType" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "originalName"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "originalName" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "publicId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "url" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "mimeType" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP COLUMN "originalName"`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD "originalName" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "displayName"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "displayName" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

}
