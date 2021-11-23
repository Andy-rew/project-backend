// import moment from 'moment';
// import sendtype from '@polka/send-type';
// import { STATUS_CODES } from 'http';
// import { Middleware } from 'polka';
// import { Op } from 'sequelize';
//
// import sequelize from '../sequelize';
// import { PROD } from '../util/secrets';
//
//
// export const getAllUsers: Middleware = async (_req, res) => {
//   const users = await User.findAll();
//   sendtype(res, 200, users);
// };
//

// export const deleteUser = async (req: Request, res: ServerResponse) => {
//   const { userId } = req.params;
//   const user = await User.findByPk(userId);
//   if (!user) {
//     return sendtype(res, 404, { message: 'Not found' });
//   }
//   await user.destroy();
//   sendtype(res, 200, { message: 'ok' });
// };




// export const inviteUser: Middleware = async (req, res) => {
//   const { surname, name, midname, email, roles } = req.body;
//
//   let user = await User.findOne({ where: { email: { [Op.iLike]: email } } });
//   if (user) {
//     return sendtype(res, 400, { message: STATUS_CODES[400] });
//   }
//
//   let userPassword: Relation;
//   await sequelize.transaction(async (t) => {
//     user = await User.create(
//       {
//         surname,
//         name,
//         midname,
//         email,
//         isActivated: false,
//         roles,
//       },
//       { transaction: t }
//     );
//     userPassword = await Relation.create(
//       {
//         userId: user.id,
//         activationCode: email + user.initials + moment().valueOf(),
//       },
//       { transaction: t }
//     );
//   });
//
//   sendtype(res, 201, {
//     message: 'ok',
//     ...(!PROD ? { activationCode: userPassword.activationCode } : {}),
//   });
//
//   sendMailMsg(
//     inviteMsg(user, {
//       inviterInitials: (req.user as User).initials,
//       userPassword,
//     })
//   );
// };


import { Request } from 'polka';
import { ServerResponse } from 'http';
import { Accident } from '../models/Accident';
import sendtype from '@polka/send-type';
import { Op } from 'sequelize';

export const getAccidents = async (req: Request, res: ServerResponse) => {
  const { rows: accidents, count } = await Accident.findAndCountAll();

  sendtype(res, 200, {accidents, count});
};

export const getAccidentsDate = async (req: Request, res: ServerResponse) => {
  const {start, end} = req.query;
  const { rows: accidents, count } = await Accident.findAndCountAll({where:{
    registerDate:  {
    [Op.between]: [
      start,
      end,
    ] as any,
  },
    }});

  sendtype(res, 200, {accidents, count});
};

export const deleteAccidents = async (req: Request, res: ServerResponse) => {
  const { id } = req.params;
  const accident = await Accident.findByPk(id);
  if (!accident) {
    return sendtype(res, 404, { message: 'Not found' });
  }
  await accident.destroy();
  sendtype(res, 200, {message: 'ok'});
};
