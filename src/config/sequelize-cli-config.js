/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config({ path: '.env.example' });
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    port: 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.TEST_DBNAME,
    host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    port: 5432,
    dialect: 'postgres',
  },
};
