import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMediaFileTable1757206004119 implements MigrationInterface {
    name = 'CreateMediaFileTable1757206004119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "avatar" character varying(500), "bio" text, "displayName" character varying(100), "isActive" boolean NOT NULL DEFAULT true, "lastLoginAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "media_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originalName" character varying(255) NOT NULL, "mimeType" character varying(100) NOT NULL, "size" integer NOT NULL, "url" character varying(500) NOT NULL, "publicId" character varying(255) NOT NULL, "altText" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_cac82b29eea888470cc40043b76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD CONSTRAINT "FK_15d1b8462301253c6aaa5d39622" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media_file" DROP CONSTRAINT "FK_15d1b8462301253c6aaa5d39622"`);
        await queryRunner.query(`DROP TABLE "media_file"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
