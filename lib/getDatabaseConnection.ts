import 'reflect-metadata';
import { createConnection, getConnectionManager } from 'typeorm';
import config from 'ormconfig.json';
import { Post } from 'src/entity/Post';
import { User } from 'src/entity/User';
import { Comment } from 'src/entity/Comment';

const promise = (async function () {
  const manager = getConnectionManager();
  const current = manager.has('default') && manager.get('default');
  current && (await current.close());
  // @ts-ignore
  return createConnection({ ...config, entities: [Post, User, Comment] });
})();

const getDatabaseConnection = () => promise;

export default getDatabaseConnection;
