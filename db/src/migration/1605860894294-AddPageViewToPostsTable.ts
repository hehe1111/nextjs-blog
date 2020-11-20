import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPageViewToPostsTable1605860894294
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'pageView',
        type: 'int',
        isNullable: false,
        default: 0,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('posts', 'pageView');
  }
}
