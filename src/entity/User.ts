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
import getDatabaseConnection from 'lib/getDatabaseConnection';
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
  // Relation decorators: allow to pass string instead of typeFunction
  // https://github.com/typeorm/typeorm/issues/4190
  @OneToMany('Post', 'author')
  posts: Post[];
  @OneToMany('Comment', 'user')
  comments: Comment[];

  // 只是声明了实例属性的类型，未赋值，所以用冒号
  password: string;
  passwordConfirmation?: string;

  async validateSignUp() {
    const errors = {
      username: [] as string[],
      password: [] as string[],
      passwordConfirmation: [] as string[],
    };
    const _name = this.username.trim();
    _name === '' && errors.username.push('用户名不能为空');
    !/[0-9A-Za-z]+/g.test(_name) &&
      errors.username.push('用户名只能由大小写字母或数字组成');
    _name.length < 3 && errors.username.push('用户名不能少于 3 位');
    _name.length > 16 && errors.username.push('用户名不能多于 16 位');
    const found = await (await getDatabaseConnection()).manager.findOne(
      'User',
      { where: { username: this.username } }
    );
    found && errors.username.push('用户名已被占用');
    this.password.length === 0 && errors.password.push('密码不能为空');
    this.password !== this.passwordConfirmation &&
      errors.passwordConfirmation.push('密码与确认密码不一致');

    return {
      hasErrors: !!Object.values(errors).find(v => v.length > 0),
      errors,
    };
  }

  async validateSignIn() {
    const errors = { username: [] as string[], password: [] as string[] };
    this.username.trim() === '' && errors.username.push('请填写用户名');
    this.password.trim() === '' && errors.password.push('请填写密码');
    const found = await (await getDatabaseConnection()).manager.findOne(
      'User',
      { where: { username: this.username } }
    ) as User;
    if (found) {
      if (found.passwordDigest !== md5(this.password)) {
        errors.password.push('密码与用户名不匹配');
      }
    } else {
      this.username.trim() !== '' && errors.username.push('用户不存在');
    }

    return {
      hasErrors: !!Object.values(errors).find(v => v.length > 0),
      errors,
      found,
    };
  }

  @BeforeInsert()
  generatePasswordDigest() {
    this.passwordDigest = md5(this.password);
  }

  toJSON() {
    return omit(this, ['password', 'passwordConfirmation', 'passwordDigest']);
  }
}
