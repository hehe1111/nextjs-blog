import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Post } from './entity/Post';
import { User } from './entity/User';
import { Comment } from './entity/Comment';

createConnection()
  .then(async connection => {
    const { manager } = connection;
    const users = await manager.find(User);
    let user, post, comment;
    if (!users.length) {
      user = new User();
      user.username = 'Bob';
      user.password = '1';
      await manager.save(user);
    }
    const posts = await manager.find(Post);
    if (!posts.length) {
      post = new Post();
      post.title = 'Post 1';
      post.content = 'Content of post 1.';
      const user = await manager.findOne(User);
      post.author = user as User;
      await manager.save(post);
    }
    const comments = await manager.find(Comment);
    if (!comments.length) {
      comment = new Comment();
      const user = await manager.findOne(User);
      comment.user = user as User;
      const post = await manager.findOne(Post);
      comment.post = post as Post;
      comment.content = 'This is a comment.';
      await manager.save(comment);
    }
    await connection.close();
    console.log('SEED DONE!');
  })
  .catch(error => console.log(error));
