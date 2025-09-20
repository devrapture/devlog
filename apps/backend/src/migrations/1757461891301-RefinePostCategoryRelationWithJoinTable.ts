import { MigrationInterface, QueryRunner } from "typeorm";

export class RefinePostCategoryRelationWithJoinTable1757461891301 implements MigrationInterface {
    name = 'RefinePostCategoryRelationWithJoinTable1757461891301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_categories_category" ("postId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_91306c0021c4901c1825ef097ce" PRIMARY KEY ("postId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_93b566d522b73cb8bc46f7405b" ON "post_categories_category" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5e63f80ca58e7296d5864bd2d" ON "post_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "post_categories_category" ADD CONSTRAINT "FK_93b566d522b73cb8bc46f7405bd" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_categories_category" ADD CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_categories_category" DROP CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3"`);
        await queryRunner.query(`ALTER TABLE "post_categories_category" DROP CONSTRAINT "FK_93b566d522b73cb8bc46f7405bd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5e63f80ca58e7296d5864bd2d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93b566d522b73cb8bc46f7405b"`);
        await queryRunner.query(`DROP TABLE "post_categories_category"`);
    }

}
