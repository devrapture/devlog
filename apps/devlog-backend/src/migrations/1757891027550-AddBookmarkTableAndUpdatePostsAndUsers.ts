import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookmarkTableAndUpdatePostsAndUsers1757891027550 implements MigrationInterface {
    name = 'AddBookmarkTableAndUpdatePostsAndUsers1757891027550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "UQ_74b9b8cd79a1014e50135f266fe"`);
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "bookmarks" TO "bookmarkCount"`);
        await queryRunner.query(`CREATE TABLE "bookmarks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "postId" uuid, CONSTRAINT "PK_7f976ef6cecd37a53bd11685f32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9da212cab1c81470ba27a1d43b" ON "bookmarks" ("userId", "postId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74b9b8cd79a1014e50135f266f" ON "likes" ("userId", "postId") `);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_c6065536f2f6de3a0163e19a584" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_6e8d0bb8ca2d66f9a6bdd6aa645" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_6e8d0bb8ca2d66f9a6bdd6aa645"`);
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_c6065536f2f6de3a0163e19a584"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74b9b8cd79a1014e50135f266f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9da212cab1c81470ba27a1d43b"`);
        await queryRunner.query(`DROP TABLE "bookmarks"`);
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "bookmarkCount" TO "bookmarks"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "UQ_74b9b8cd79a1014e50135f266fe" UNIQUE ("userId", "postId")`);
    }

}
