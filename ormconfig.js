/*
https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md#using-ormconfigjs

https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md#which-configuration-file-is-used-by-typeorm
加载顺序
1. .env file
2. ormconfig.env
3. ormconfig.[format] files, in this order: [js, ts, json, yml, yaml, xml]

如果使用 .js/.ts 则必须引入使用，如：
import config from 'ormconfig';

createConnection(cofig);
*/

module.exports = {
  type: 'postgres',
  host: process.env.NODE_ENV === 'production' ? 'localhost' : '192.168.99.100',
  port: 5432,
  username: 'admin',
  password: '',
  database:
    process.env.NODE_ENV === 'production'
      ? 'blog_production'
      : 'blog_development',
  synchronize: false,
  logging: false,
  entities: ['db/dist/entity/**/*.js'],
  migrations: ['db/dist/migration/**/*.js'],
  subscribers: ['db/dist/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'db/src/entity',
    migrationsDir: 'db/src/migration',
    subscribersDir: 'db/src/subscriber',
  },
};
