import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import md5 from 'md5';
import omit from 'lodash/omit';

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
  @OneToMany(type => Post, post => post.author)
  posts: Post[];
  @OneToMany(type => Comment, comment => comment.user)
  comments: Comment[];

  // 只是声明了实例属性的类型，未赋值，所以用冒号
  password: string;
  passwordConfirmation: string;
  // 声明了实例属性，且赋值了，所以用等号
  errors = {
    username: [] as string[],
    password: [] as string[],
    passwordConfirmation: [] as string[],
  };

  async validate() {
    const _name = this.username.trim();
    _name === '' && this.errors.username.push('用户名不能为空');
    !/[0-9A-Za-z]+/g.test(_name) &&
      this.errors.username.push('用户名只能由大小写字母或数字组成');
    _name.length < 3 && this.errors.username.push('用户名不能少于 3 位');
    _name.length > 16 && this.errors.username.push('用户名不能多于 16 位');
    // 找不到则返回空数组
    const found = await (await getDatabaseConnection()).manager.find(User, {
      username: this.username,
    });
    found.length > 0 && this.errors.username.push('用户名已被占用');
    this.password.length === 0 && this.errors.password.push('密码不能为空');
    this.password !== this.passwordConfirmation &&
      this.errors.passwordConfirmation.push('密码与确认密码不一致');
  }

  hasErrors() {
    return !!Object.values(this.errors).find(v => v.length > 0);
  }

  @BeforeInsert()
  generatePasswordDigest() {
    this.passwordDigest = md5(this.password);
  }

  toJSON() {
    return omit(this, [
      'password',
      'passwordConfirmation',
      'passwordDigest',
      'errors',
    ]);
  }
}
