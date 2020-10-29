import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Post } from './entity/Post';

createConnection()
  .then(async connection => {
    const p1 = await connection.manager.find(Post);
    console.log(p1);
    const post = new Post();
    post.title = 'Article 1';
    post.content = 'This is my first article. Hello world.';
    await connection.manager.save(post);
    const p2 = await connection.manager.find(Post);
    console.log(p2);
    connection.close();
  })
  .catch(error => console.log(error));
