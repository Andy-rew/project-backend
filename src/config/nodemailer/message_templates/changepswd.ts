import moment from 'moment';

import { Msg } from '..';
import { FRONTEND_APP_URL } from '../../../util/secrets';

import { User } from '../../../models/User';
import { UserPassword } from '../../../models/UserPassword';

export const changePasswordMsg = (
  user: User,
  data: {
    userPassword: UserPassword;
  }
): Msg => {
  const { userPassword } = data;
  const href = `${FRONTEND_APP_URL}/partner/password-recovery?activationCode=${userPassword.activationCode}`;
  const inviteMsgTemplate = `Для изменения пароля в <strong>ИС "ЛЭТИ-классы"</strong> перейдите по ссылке:
    <a href="${href}" rel="noopener" style="text-decoration: underline; color: #05336e;" target="_blank">${href}</a>
    <br>
    (ссылка действительна до ${moment(
      userPassword.activationCodeStopDate
    ).format('DD.MM.YYYY HH:mm')})`;
  return {
    to: user.email,
    receiverName: user.nameMidname,
    subject: 'ИС ИОТ. Изменение пароля',
    content: inviteMsgTemplate,
    href,
    hrefText: 'Изменить пароль',
  };
};
