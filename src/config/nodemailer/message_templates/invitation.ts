import moment from 'moment';

import { Msg } from '..';
import { FRONTEND_APP_URL } from '../../../util/secrets';

import { User } from '../../../models/User';
import { UserPassword } from '../../../models/UserPassword';

export const inviteMsg = (
  user: User,
  data: {
    inviterInitials: string;
    userPassword: UserPassword;
  }
): Msg => {
  const { inviterInitials, userPassword } = data;
  const href = `${FRONTEND_APP_URL}/partner/registration?activationCode=${userPassword.activationCode}`;
  const inviteMsg = `${inviterInitials} приглашает Вас в <strong>ИС "ЛЭТИ-классы"</strong>.
    Пожалуйста, для завершения регистрации перейдите по ссылке:
    <a href="${href}" rel="noopener" style="text-decoration: underline; color: #05336e;" target="_blank">${href}</a>
    <br>
    (ссылка действительна до ${moment(userPassword.activationCodeStopDate)
      .utcOffset('+0300')
      .format('DD.MM.YYYY HH:mm')} МСК)`;
  return {
    to: user.email,
    receiverName: user.nameMidname,
    subject: 'ЛЭТИ-классы. Приглашение в систему',
    content: inviteMsg,
    href,
    hrefText: 'Зарегистрироваться',
  };
};
