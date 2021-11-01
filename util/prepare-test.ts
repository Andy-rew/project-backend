import { execSync } from 'child_process';

import sequelize from '../src/sequelize';
import { DB_NAME, DB_PASS, DB_USER, DB_SCHEMA } from '../src/util/secrets';

function execSql(sql: string, options = '') {
  if (sql.indexOf('"') > -1) {
    sql = `'${sql}'`;
  } else {
    sql = `"${sql}"`;
  }
  return execSync(
    `PGPASSWORD=${DB_PASS} psql ${options} \
    -h ${process.env.DB_HOST || 'localhost'} \
    -U ${DB_USER} \
    -c ${sql}
      `
  ).toString();
}

const res = execSql(
  `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`,
  '-tA'
);
const dbExists = res.indexOf('1') > -1;
if (!dbExists) {
  const createRes = execSql(`CREATE DATABASE "${DB_NAME}"`);
  console.log(createRes);
} else {
  console.log('Database already exists');
}
execSql(`DROP SCHEMA IF EXISTS "${DB_SCHEMA}" CASCADE`, DB_NAME);
execSql(`CREATE SCHEMA "${DB_SCHEMA}"`, DB_NAME);

(async () => {
  await sequelize.sync({ force: true });
  process.exit(0);
})();
