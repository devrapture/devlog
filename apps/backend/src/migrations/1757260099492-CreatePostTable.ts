import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostTable1757260099492 implements MigrationInterface {
    name = 'CreatePostTable1757260099492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."post_status_enum" AS ENUM('published', 'draft')`);
        await queryRunner.query(`CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "body" text NOT NULL, "status" "public"."post_status_enum" NOT NULL DEFAULT 'draft', "coverImage" text, "slug" text NOT NULL, "publishedAt" TIME WITH TIME ZONE, "views" integer NOT NULL DEFAULT '0', "likes" integer NOT NULL DEFAULT '0', "comments" integer NOT NULL DEFAULT '0', "bookmarks" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TYPE "public"."post_status_enum"`);
    }

}
