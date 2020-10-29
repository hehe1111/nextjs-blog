import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnPasswordDigest1603965886271
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'users',
      'password_digest',
      'passwordDigest'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'users',
      'passwordDigest',
      'password_digest'
    );
  }
}
