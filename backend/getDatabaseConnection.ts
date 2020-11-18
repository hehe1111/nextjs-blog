import 'reflect-metadata';
import { createConnection, getConnectionManager } from 'typeorm';
import config from 'ormconfig';
import { Post } from 'db/src/entity/Post';
import { User } from 'db/src/entity/User';

const promise = (async function () {
  const manager = getConnectionManager();
  const current = manager.has('default') && manager.get('default');
  current && (await current.close());
  // @ts-ignore
  return createConnection({ ...config, entities: [Post, User] });
})();

const getDatabaseConnection = () => promise;

export default getDatabaseConnection;
