import 'reflect-metadata';
import { createConnection, getConnectionManager } from 'typeorm';

const promise = (async function () {
  const manager = getConnectionManager();
  if (manager.has('default')) {
    const current = manager.get('default');
    return current.isConnected ? current : current.connect();
  }
  return createConnection();
})();

const getDatabaseConnection = () => promise;

export default getDatabaseConnection;
