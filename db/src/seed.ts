import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Post } from './entity/Post';
import { User } from './entity/User';
import { Comment } from './entity/Comment';

createConnection()
  .then(async connection => {
    const { manager } = connection;
    const users = await manager.find<User>('User');
    let user: User, post: Post, comment: Comment;
    if (!users.length) {
      user = new User();
      user.username = 'Bob';
      user.password = '1';
      await manager.save(user);
    }
    const posts = await manager.find<Post>('Post');
    if (!posts.length) {
      post = new Post();
      post.title = 'Post 1';
      post.content = 'Content of post 1.';
      const user = await manager.findOne<User>('User');
      post.author = user;
      await manager.save(post);
    }
    const comments = await manager.find<Comment>('Comment');
    if (!comments.length) {
      const post = await manager.findOne<Post>('Post');
      for (let i = 1; i < 10; i++) {
        comment = new Comment();
        comment.username = `用户${Math.ceil(Math.random() * 10000 + 1000)}`;
        comment.email = `${i}@example.com`;
        comment.content = `This is a comment.${i}`;
        comment.post = post;
        await manager.save(comment);
      }

      let comment2 = new Comment();
      comment = await manager.findOne<Comment>('Comment');
      comment2.username = 'nobody2';
      comment2.email = '456@example.com';
      comment2.content = 'Reply to nobody.';
      comment2.post = post;
      comment2.sourceCommentId = comment.id;
      comment2.replyTo = comment.username;
      await manager.save(comment2);

      const comment3 = new Comment();
      comment2 = await manager.findOne<Comment>('Comment', {
        where: { username: comment2.username },
      });
      comment3.username = 'nobody3';
      comment3.email = '789@example.com';
      comment3.content = 'Reply to nobody2.';
      comment3.post = post;
      comment3.sourceCommentId = comment2.sourceCommentId;
      comment3.replyTo = comment2.username;
      await manager.save(comment3);
    }
    await connection.close();
    console.log('SEED DONE!');
  })
  .catch(error => console.log(error));
