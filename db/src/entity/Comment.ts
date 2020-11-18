import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('int')
  postId: number;
  @Column('int')
  sourceCommentId: number;
  @Column('varchar')
  replyTo: string;
  @Column('varchar')
  username: string;
  @Column('varchar')
  email: string;
  @Column('text')
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne('Post', 'comments')
  post: Post;
}
