import sendtype from '@polka/send-type';
import { Middleware } from 'polka';

import { User, UserRoles } from '../models/User';

export const ensureLoggedIn: Middleware = (req, res, next) => {
  if (!req.user) {
    return sendtype(res, 401, {
      message: 'Недостаточно прав',
      isLoggedIn: false,
    });
  }
  next();
};

export function reqAnyOfRoles(roles?: UserRoles[]): Middleware {
  return (req, res, next) => {
    if (!roles) {
      return next();
    }
    if (!roles.some((role) => (req.user as User).roles.includes(role))) {
      return sendtype(res, 401, { message: 'Недостаточно прав' });
    }
    next();
  };
}
