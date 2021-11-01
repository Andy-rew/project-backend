import appRoot from 'app-root-path';
import winston from 'winston';
import moment from 'moment';
import 'winston-daily-rotate-file';

const LEVEL = Symbol.for('level');
const prod = process.env.NODE_ENV === 'production';

const { combine, timestamp, colorize, printf, simple, json } = winston.format;

function filterOnly(level: string) {
  return winston.format((info: any) => {
    if (info[LEVEL] === level) {
      return info;
    }
  })();
}

function formatParamsCombined(info: any) {
  const { timestamp, level, message } = info;
  const ts = timestamp.slice(0, 19).replace('T', ' ');

  return `"${ts}","${level}",${message}`;
}

function formatParamsError(info: any) {
  return JSON.stringify(info);
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      format: combine(
        filterOnly('info'),
        timestamp(),
        printf(formatParamsCombined)
      ),
      level: 'info',
      dirname: `${appRoot}/logs`,
      filename: 'api_info_%DATE%.log',
      auditFile: `${appRoot}/logs/audit_info.json`,
      datePattern: 'DD-MM-YYYY',
      handleExceptions: true,
      maxSize: '5m',
      maxFiles: 5,
    }),
    new winston.transports.DailyRotateFile({
      format: combine(json(), timestamp(), printf(formatParamsError)),
      level: 'error',
      dirname: `${appRoot}/logs`,
      filename: 'api_error_%DATE%.log',
      auditFile: `${appRoot}/logs/audit_error.json`,
      datePattern: 'DD-MM-YYYY',
      handleExceptions: true,
      maxSize: '5m',
      maxFiles: 5,
    }),
  ],
});

const formatEmail = winston.format.printf(({ to, subject, msgbody }) => {
  return `
  <hr>
TIME: ${moment().toISOString()}<br>
TO: ${to}<br>
SUBJECT: ${subject}<br>
${msgbody}
`;
});

export const mailLogger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      format: formatEmail,
      level: 'info',
      dirname: `${appRoot}/logs`,
      filename: 'mail_%DATE%.html',
      auditFile: `${appRoot}/logs/audit_error.json`,
      datePattern: 'MM-DD-YYYY',
      maxSize: '5m',
      maxFiles: 5,
    }),
  ],
});

if (!prod) {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize({ all: true }), simple()),
      handleExceptions: true,
    })
  );
  logger.debug('Logging initialized at debug level');
}

export class LoggerStream {
  write(message: string): void {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}

export default logger;
