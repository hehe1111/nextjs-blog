import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Post } from './entity/Post';
import { User } from './entity/User';

createConnection()
  .then(async connection => {
    const { manager } = connection;
    const users = await manager.find(User);
    let user: User, post: Post;
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
    await connection.close();
    console.log('SEED DONE!');
  })
  .catch(error => console.log(error));
