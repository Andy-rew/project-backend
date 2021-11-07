// import { Middleware } from 'polka';
// import { STATUS_CODES } from 'http';
// import passport from 'passport';
// import sendtype from '@polka/send-type';
// import redirect from '@polka/redirect';
// import moment from 'moment';
// import axios from 'axios';
// import { Op } from 'sequelize';
//
// import sequelize from '../sequelize';
// import {
//   FRONTEND_APP_URL,
//   PROD,
// } from '../util/secrets';
// import { sendMailMsg, changePasswordMsg } from '../config/nodemailer';
//
// import { User } from '../models/Person';
// import { Relation } from '../models/UserPassword';
//
//
// export const authWithPassword: Middleware = async (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return sendtype(res, 403, { message: info.message });
//     }
//     req.login(user, (err: string | Error) => {
//       if (err) {
//         return next(err);
//       }
//       return sendtype(res, 200, { message: 'ok' });
//     });
//   })(req, res, next);
// };
//
// export const logout: Middleware = async (req, res) => {
//   req.logout();
//   return sendtype(res, 200, { message: 'ok' });
// };
//
// export const activationCodeCheck: Middleware = async (req, res) => {
//   const { code: activationCode } = req.params;
//   const user = await User.findOne({
//     include: [
//       {
//         model: Relation,
//         where: { activationCode },
//       },
//     ],
//   });
//
//   if (!user) {
//     return sendtype(res, 404, { message: STATUS_CODES[404] });
//   }
//
//   const { activationCodeStopDate } = user.passwordData;
//   if (moment(activationCodeStopDate).isBefore(moment())) {
//     return sendtype(res, 403, { message: STATUS_CODES[403] });
//   }
//
//   const { id, surname, name, midname, email } = user;
//
//   return sendtype(res, 200, { id, surname, name, midname, email });
// };
//
// export const signUp: Middleware = async (req, res) => {
//   const {
//     password,
//     samePasswordForConfirm,
//     activationCode,
//     userId,
//     surname,
//     name,
//     midname,
//     email,
//   } = req.body;
//
//   if (password !== samePasswordForConfirm) {
//     return sendtype(res, 406, { message: STATUS_CODES[406] });
//   }
//
//   const user = await User.findOne({
//     where: { id: userId },
//     include: [
//       {
//         model: Relation,
//         where: { activationCode },
//       },
//     ],
//   });
//   if (!user) {
//     return sendtype(res, 404, { message: STATUS_CODES[404] });
//   }
//
//   await sequelize.transaction(async (t) => {
//     await user.update(
//       {
//         surname,
//         name,
//         midname,
//         email,
//         isActivated: true,
//       },
//       { transaction: t }
//     );
//
//     await user.passwordData.update(
//       {
//         activationCode: null,
//         password,
//       },
//       { transaction: t }
//     );
//   });
//
//   return sendtype(res, 200, { message: 'ok' });
// };
//
// export const checkEmailAndSetActivationCode: Middleware = async (req, res) => {
//   const { email } = req.body;
//
//   const user = await User.findOne({
//     where: {
//       email: {
//         [Op.iLike]: email,
//       },
//     },
//     include: [
//       {
//         model: Relation,
//         required: true,
//       },
//     ],
//   });
//
//   if (!user) {
//     return sendtype(res, 404, { message: STATUS_CODES[404] });
//   }
//
//   await user.passwordData.update({
//     activationCode: email + user.initials + moment().valueOf(),
//   });
//
//   sendMailMsg(changePasswordMsg(user, { userPassword: user.passwordData }));
//
//   return sendtype(res, 200, {
//     message: 'ok',
//     ...(!PROD ? { activationCode: user.passwordData.activationCode } : {}),
//   });
// };
//
// export const passwordChange: Middleware = async (req, res) => {
//   const { password, samePasswordForConfirm, activationCode, userId } = req.body;
//
//   if (password !== samePasswordForConfirm) {
//     return sendtype(res, 406, { message: STATUS_CODES[406] });
//   }
//
//   const user = await User.findOne({
//     where: { id: userId },
//     include: [
//       {
//         model: Relation,
//         where: { activationCode },
//       },
//     ],
//   });
//
//   if (!user) {
//     return sendtype(res, 404, { message: STATUS_CODES[404] });
//   }
//
//   await user.passwordData.update({
//     activationCode: null,
//     password,
//   });
//
//   return sendtype(res, 200, { message: 'ok' });
// };
//
// export const devAuth: Middleware = async (req, res, next) => {
//   passport.authenticate('dev-auth', (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return sendtype(res, 404, { message: info?.message ?? 'cant get user' });
//     }
//     req.login(user, (err: string | Error) => {
//       if (err) {
//         return next(err);
//       }
//       if (!req.query.noRedirect) {
//         return redirect(res, FRONTEND_APP_URL);
//       }
//       return sendtype(res, 200, user);
//     });
//   })(req, res, next);
// };
//
// export const getCurrUser: Middleware = async (req, res) => {
//   return sendtype(res, 200, { user: req.user ?? null });
// };
