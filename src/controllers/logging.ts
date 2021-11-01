import { Middleware } from 'polka';
import sendtype from '@polka/send-type';
import { STATUS_CODES } from 'http';
import * as fs from 'fs';
import appRoot from 'app-root-path';
import { literal, where as seqWhere, Op } from 'sequelize';
import moment from 'moment';

import {
  getPagination,
  getWhere,
  getOrderBy,
  unpack,
} from '../util/pagination';

import { LogRecord } from '../models/LogRecord';
import { User } from '../models/User';

export const createLogs: Middleware = async (req, res) => {
  const { logs } = req.body;
  const user = req.user as User;
  await LogRecord.bulkCreate(
    logs.map((l: any) => ({
      ...l,
      userId: user.actualUser?.id || user.id,
      fakeUserId: user.actualUser ? user.id : null,
    }))
  );
  sendtype(res, 200, { ok: true });
};

export const getLogs: Middleware = async (req: any, res) => {
  const { limit, offset } = getPagination(req);
  const where = getWhere(req);
  let order = getOrderBy(req);
  if (order.length === 0) {
    order = [['timestamp', 'DESC']];
  }
  const { rows: logs, count } = await LogRecord.findAndCountAll({
    limit,
    distinct: true,
    offset,
    include: [
      {
        model: User,
        as: 'user',
        where: {
          ...unpack(where, ['user.surname', 'user.roles']),
        },
      },
      {
        model: User.scope('small'),
        as: 'fakeUser',
      },
    ],
    where: {
      ...(where.severity ? { severity: where.severity } : {}),
      ...(where.message ? { message: where.message } : {}),
      ...(where.timestamp
        ? {
            [Op.and]: [
              seqWhere(
                literal('"LogRecord"."timestamp"::date'),
                where.timestamp
              ),
            ],
          }
        : {}),
      ...(where.page ? { page: where.page } : {}),
      ...(where.error ? { error: where.error } : {}),
      ...(where.userId ? { userId: where.userId } : {}),
      ...(where.viewer ? { userId: where.viewerId } : {}),
    },
    order,
  });
  sendtype(res, 200, { logs, count });
};

export const getApiLogs: Middleware = async (req, res) => {
  const { type } = req.params;
  if (!['info', 'error'].includes(type)) {
    return sendtype(res, 400, { message: STATUS_CODES[400] });
  }

  const logsPath = `${appRoot}/logs`;
  const fileNamePrefix = `api_${type}`;
  const logFileNames = fs
    .readdirSync(logsPath)
    .filter((f) => f.includes(fileNamePrefix))
    .sort((a, b) => {
      const date1 = moment(a.match(/\d{2}-\d{2}-\d{4}/g)[0], 'DD-MM-YYYY');
      const date2 = moment(b.match(/\d{2}-\d{2}-\d{4}/g)[0], 'DD-MM-YYYY');
      return date1.isBefore(date2) ? 1 : -1;
    });

  const fileName = logFileNames[Number(req.query.fileName) || 0];

  const path = `${logsPath}/${fileName}`;

  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      return sendtype(res, 404, { message: `Файл ${fileName} отсутствует` });
    }
    const logs = fs.readFileSync(path, 'utf-8');
    sendtype(res, 200, { logs, fileName, logFileNames });
  });
};
