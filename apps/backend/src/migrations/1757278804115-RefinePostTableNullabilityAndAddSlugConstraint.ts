import { MigrationInterface, QueryRunner } from "typeorm";

export class RefinePostTableNullabilityAndAddSlugConstraint1757278804115 implements MigrationInterface {
    name = 'RefinePostTableNullabilityAndAddSlugConstraint1757278804115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop NOT NULL constraints for title, body, and slug
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "body" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "slug" DROP NOT NULL`);
        
        // Add unique constraint on slug if it doesn't already exist
        const constraintExists = await queryRunner.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'UQ_cd1bddce36edc3e766798eab376' 
            AND table_name = 'post'
        `);
        
        if (parseInt(constraintExists[0].count) === 0) {
            await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "UQ_cd1bddce36edc3e766798eab376" UNIQUE ("slug")`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the unique constraint if it exists
        const constraintExists = await queryRunner.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'UQ_cd1bddce36edc3e766798eab376' 
            AND table_name = 'post'
        `);
        
        if (parseInt(constraintExists[0].count) > 0) {
            await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "UQ_cd1bddce36edc3e766798eab376"`);
        }
        
        // Restore NOT NULL constraints
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "slug" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "body" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "title" SET NOT NULL`);
    }

}
