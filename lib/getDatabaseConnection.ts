import 'reflect-metadata';
import { createConnection, getConnectionManager } from 'typeorm';
import config from 'ormconfig.json';
import { Post } from 'src/entity/Post';
import { User } from 'src/entity/User';
import { Comment } from 'src/entity/Comment';

const promise = (async function () {
  const manager = getConnectionManager();
  if (manager.has('default')) {
    const current = manager.get('default');
    return current.isConnected ? current : current.connect();
  }
  // @ts-ignore
  return createConnection({ ...config, entities: [Post, User, Comment] });
})();

const getDatabaseConnection = () => promise;

export default getDatabaseConnection;
