import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCommentsTable1603964895044 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'userId', type: 'int' },
          { name: 'postId', type: 'int' },
          { name: 'content', type: 'text' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('comments');
  }
}
