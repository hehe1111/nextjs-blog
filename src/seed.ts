import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Post } from './entity/Post';

createConnection()
  .then(async connection => {
    const postArray = await connection.manager.find(Post);
    if (postArray.length === 0) {
      await connection.manager.save(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
          i => new Post({ title: `Post ${i}`, content: `This is post ${i}` })
        )
      );
      console.log('填充了 10 条数据');
    }
    connection.close();
  })
  .catch(error => console.log(error));
