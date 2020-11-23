import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import md5 from 'md5';
import omit from 'lodash/omit';
import { Post } from './Post';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('varchar')
  username: string;
  @Column('varchar')
  passwordDigest: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // Relation decorators: allow to pass string instead of typeFunction
  // https://github.com/typeorm/typeorm/issues/4190
  @OneToMany('Post', 'author')
  posts: Post[];

  // 只是声明了实例属性及其类型，未赋值，所以用冒号
  password: string;

  @BeforeInsert()
  generatePasswordDigest(): void {
    const { SALT_1, SALT_2, SALT_3 } = process.env;
    this.passwordDigest = md5(
      md5(md5(this.password + SALT_1) + SALT_2) + SALT_3
    );
  }

  toJSON(): Partial<this> {
    return omit(this, ['password', 'passwordConfirmation', 'passwordDigest']);
  }
}
