import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexesToPostAndCategoryAndRefinePost1757793923519 implements MigrationInterface {
    name = 'AddIndexesToPostAndCategoryAndRefinePost1757793923519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "publishedAt"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "publishedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "idx_category_name" ON "category" ("name") `);
        await queryRunner.query(`CREATE INDEX "idx_post_title" ON "post" ("title") `);
        await queryRunner.query(`CREATE INDEX "idx_post_createdAt" ON "post" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "idx_post_status" ON "post" ("status") `);
        await queryRunner.query(`CREATE INDEX "idx_post_authorId" ON "post" ("authorId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_post_authorId"`);
        await queryRunner.query(`DROP INDEX "public"."idx_post_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_post_createdAt"`);
        await queryRunner.query(`DROP INDEX "public"."idx_post_title"`);
        await queryRunner.query(`DROP INDEX "public"."idx_category_name"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "publishedAt"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "publishedAt" TIME WITH TIME ZONE`);
    }

}
