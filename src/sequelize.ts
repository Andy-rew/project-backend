import { Sequelize } from 'sequelize-typescript';
import { ENVIRONMENT, DB_NAME, DB_USER, DB_PASS } from './util/secrets';

const sequelize = new Sequelize({
  database: DB_NAME,
  dialect: 'postgres',
  username: DB_USER,
  password: DB_PASS,
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  models: [__dirname + '/models'],
  ...(ENVIRONMENT === 'test' ? { logging: false } : {}),
  ...(process.env.NO_SEQUELIZE_LOG === 'true' ? { logging: false } : {}),
});

export default sequelize;
