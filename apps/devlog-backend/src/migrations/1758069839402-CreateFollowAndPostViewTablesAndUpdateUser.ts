import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFollowAndPostViewTablesAndUpdateUser1758069839402 implements MigrationInterface {
    name = 'CreateFollowAndPostViewTablesAndUpdateUser1758069839402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_c6065536f2f6de3a0163e19a584"`);
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_6e8d0bb8ca2d66f9a6bdd6aa645"`);
        await queryRunner.query(`CREATE TABLE "follow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "followerId" uuid, "followingId" uuid, CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2952595a5bec0052c5da0751cc" ON "follow" ("followerId", "followingId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "followingCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "followersCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_c6065536f2f6de3a0163e19a584" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_6e8d0bb8ca2d66f9a6bdd6aa645" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_e9f68503556c5d72a161ce38513" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_e9f68503556c5d72a161ce38513"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`);
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_6e8d0bb8ca2d66f9a6bdd6aa645"`);
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_c6065536f2f6de3a0163e19a584"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "followersCount"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "followingCount"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2952595a5bec0052c5da0751cc"`);
        await queryRunner.query(`DROP TABLE "follow"`);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_6e8d0bb8ca2d66f9a6bdd6aa645" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_c6065536f2f6de3a0163e19a584" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
