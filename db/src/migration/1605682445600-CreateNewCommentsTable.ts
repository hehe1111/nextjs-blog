import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNewCommentsTable1605682445600 implements MigrationInterface {
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
          { name: 'postId', type: 'int' },
          { name: 'sourceCommentId', type: 'int', isNullable: true },
          { name: 'replyTo', type: 'varchar', isNullable: true },
          { name: 'username', type: 'varchar' },
          { name: 'email', type: 'varchar' },
          { name: 'content', type: 'text' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('comments');
  }
}
