import 'reflect-metadata';
import { Connection, createConnection, getConnectionManager } from 'typeorm';
import config from 'ormconfig';
import { Post } from 'db/src/entity/Post';
import { User } from 'db/src/entity/User';
import { Comment } from 'db/src/entity/Comment';

const promise = (async function () {
  const manager = getConnectionManager();
  const current = manager.has('default') && manager.get('default');
  current && (await current.close());
  // @ts-ignore
  return createConnection({ ...config, entities: [Post, User, Comment] });
})();

const getDatabaseConnection = (): Promise<Connection> => promise;

export default getDatabaseConnection;
