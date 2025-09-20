import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDatabaseIndexesAndFixPublishedAtDataType1757803639056 implements MigrationInterface {
    name = 'AddDatabaseIndexesAndFixPublishedAtDataType1757803639056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" text NOT NULL, "userAgent" text, "userId" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, CONSTRAINT "UQ_d7685e3330282f7d3ea9972b093" UNIQUE ("postId", "ipAddress"), CONSTRAINT "PK_89a020aa096a078dc6f602ffe20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post_view" ADD CONSTRAINT "FK_0ec6553d64793fc8970dc5fab4a" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_view" DROP CONSTRAINT "FK_0ec6553d64793fc8970dc5fab4a"`);
        await queryRunner.query(`DROP TABLE "post_view"`);
    }

}
