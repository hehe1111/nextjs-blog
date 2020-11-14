import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateUniqueIndexUsername1604126855541
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'indexUsername',
        columnNames: ['username'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'indexUsername');
  }
}
