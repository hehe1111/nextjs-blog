import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCreatedAtAndUpdatedAt1603965110627
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    ['users', 'posts', 'comments'].forEach(async table => {
      await queryRunner.addColumns(
        table,
        ['createdAt', 'updatedAt'].map(
          field =>
            new TableColumn({
              name: field,
              type: 'timestamp',
              isNullable: false,
              default: 'now()',
            })
        )
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    ['users', 'posts', 'comments'].forEach(async table => {
      ['createdAt', 'updatedAt'].forEach(async field => {
        await queryRunner.dropColumn(table, field);
      });
    });
  }
}
