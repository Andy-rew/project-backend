import appRoot from 'app-root-path';
import nodemailer from 'nodemailer';
import ejs from 'ejs';

import {
  EMAIL_HOST,
  EMAIL_ACCOUNT_LOGIN,
  EMAIL_PORT,
  EMAIL_ACCOUNT_PASW,
  EMAIL_SECURE,
  EMAIL_ACCOUNT_ADDR,
  ENVIRONMENT,
} from '../../util/secrets';
import logger, { mailLogger } from '../../util/logger';

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT),
  secure: EMAIL_SECURE === 'true',
  auth: {
    user: EMAIL_ACCOUNT_LOGIN,
    pass: EMAIL_ACCOUNT_PASW,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export type Msg = {
  to: string | string[];
  subject: string;
  content: string;
  receiverName?: string;
  href?: string;
  hrefText?: string;
};

export function transporterSendMail(
  mess: Msg,
  callback?: (error: Error, info: any) => void
): void {
  transporter.sendMail(
    {
      from:
        'ИС "Индивидуальные образовательные траектории" <' +
        EMAIL_ACCOUNT_ADDR +
        '>', // sender address
      to: mess.to, // list of receivers
      subject: mess.subject, // Subject line
      html: mess.content, // html body
    },
    callback ||
      ((error, info) => {
        if (error) {
          logger.error(error);
          return;
        }
        console.log(JSON.stringify(info));
      })
  );
}

export const sendMailMsg = (
  mess: Msg,
  callback?: (error: Error, info: any) => void
): void => {
  if (ENVIRONMENT === 'test') {
    return;
  }
  ejs.renderFile(
    `${appRoot}/src/config/nodemailer/msgbody.ejs`,
    {
      helloMsg: `Здравствуйте, ${mess.receiverName}!`,
      content: mess.content,
      href: mess.href,
      hrefText: mess.hrefText,
    },
    (err, msgbody) => {
      if (err) {
        logger.error(err);
        return;
      }
      mailLogger.log({ level: 'info', ...mess, msgbody } as any);
      if (process.env.EMAIL_DUMP) {
        return;
      }
      transporterSendMail({ ...mess, content: msgbody }, callback);
    }
  );
};

export { inviteMsg, changePasswordMsg } from './message_templates';
