import moment from 'moment';
import sendtype from '@polka/send-type';
import { STATUS_CODES } from 'http';
import { Middleware } from 'polka';
import { Op } from 'sequelize';

import sequelize from '../sequelize';
import { PROD } from '../util/secrets';
import { sendMailMsg, inviteMsg } from '../config/nodemailer';

import { User } from '../models/User';
import { UserPassword } from '../models/UserPassword';

export const getAllUsers: Middleware = async (_req, res) => {
  const users = await User.findAll();
  sendtype(res, 200, users);
};

export const inviteUser: Middleware = async (req, res) => {
  const { surname, name, midname, email, roles } = req.body;

  let user = await User.findOne({ where: { email: { [Op.iLike]: email } } });
  if (user) {
    return sendtype(res, 400, { message: STATUS_CODES[400] });
  }

  let userPassword: UserPassword;
  await sequelize.transaction(async (t) => {
    user = await User.create(
      {
        surname,
        name,
        midname,
        email,
        isActivated: false,
        roles,
      },
      { transaction: t }
    );
    userPassword = await UserPassword.create(
      {
        userId: user.id,
        activationCode: email + user.initials + moment().valueOf(),
      },
      { transaction: t }
    );
  });

  sendtype(res, 201, {
    message: 'ok',
    ...(!PROD ? { activationCode: userPassword.activationCode } : {}),
  });

  sendMailMsg(
    inviteMsg(user, {
      inviterInitials: (req.user as User).initials,
      userPassword,
    })
  );
};
