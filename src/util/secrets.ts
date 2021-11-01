import logger from './logger';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  logger.debug(
    'Using .env.example file to supply config environment variables'
  );
  dotenv.config({ path: '.env.example' });
}

export const ENVIRONMENT = process.env.NODE_ENV;
export const PROD = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

if (ENVIRONMENT === 'test') {
  process.env.DB_NAME = process.env.TEST_DBNAME;
  process.env.PORT = '0';
}

export const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.log('NO SESSION_SECRET');
  logger.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}

export const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL;
if (!FRONTEND_APP_URL) {
  console.log('NO FRONTEND_APP_URL');
  logger.error(
    'No frontent url, all urls will be blocked by cors. Set FRONTEND_APP_URL environment variable.'
  );
  process.exit(1);
} else if (FRONTEND_APP_URL.endsWith('/')) {
  console.log('FRONTEND_APP_URL ends with "/": remove this');
  logger.error('You need to remove "/" in FRONTEND_APP_URL');
  process.exit(1);
}

export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_SCHEMA = process.env.DB_SCHEMA;

if (!DB_NAME || !DB_USER || !DB_PASS || !DB_SCHEMA) {
  logger.error(
    'No database settings. Set DB_NAME, DB_USER, DB_PASS, DB_SCHEMA environment variables.'
  );
  process.exit(1);
}

export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_ACCOUNT_LOGIN = process.env.EMAIL_ACCOUNT_LOGIN;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_ACCOUNT_PASW = process.env.EMAIL_ACCOUNT_PASW;
export const EMAIL_SECURE = process.env.EMAIL_SECURE;
export const EMAIL_ACCOUNT_ADDR = process.env.EMAIL_ACCOUNT_ADDR;

if (
  !EMAIL_HOST ||
  !EMAIL_ACCOUNT_LOGIN ||
  !EMAIL_PORT ||
  !EMAIL_ACCOUNT_PASW ||
  !EMAIL_SECURE ||
  !EMAIL_ACCOUNT_ADDR
) {
  logger.error(
    'No Node Mailer settings. Set EMAIL_HOST, EMAIL_ACCOUNT_LOGIN, EMAIL_PORT, EMAIL_ACCOUNT_PASW, EMAIL_SECURE, EMAIL_ACCOUNT_ADDR environment variables.'
  );
  process.exit(1);
}

export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
export const RECAPTCHA_URL = process.env.RECAPTCHA_URL;

if (!RECAPTCHA_SECRET_KEY || !RECAPTCHA_URL) {
  logger.error(
    'No RECAPTCHA settings. Set RECAPTCHA_SECRET_KEY, RECAPTCHA_URL environment variables.'
  );
  process.exit(1);
}
