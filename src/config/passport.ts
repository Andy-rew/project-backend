import passport from 'passport';
import passportLocal from 'passport-local';
import passportCustom from 'passport-custom';
import { Op } from 'sequelize';
import { Request } from 'polka';

import { getDevUser } from './auth_functions';

import { User } from '../models/User';
import { UserPassword } from '../models/UserPassword';

const LocalStrategy = passportLocal.Strategy;
const DevAuthStrategy = passportCustom.Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password',
    },
    async (login: string, password: string, done: any) => {
      let user = await User.findOne({
        where: {
          email: {
            [Op.iLike]: login,
          },
        },
        include: [UserPassword],
      });

      if (
        !user ||
        !user.isActivated ||
        !user.passwordData?.isPasswordCorrect(password)
      ) {
        return done(null, null, { message: 'Ошибка авторизации' });
      }

      user = user.toJSON() as User;
      delete user.passwordData;

      return done(null, user);
    }
  )
);

passport.use(
  'dev-auth',
  new DevAuthStrategy(async function (req, done) {
    done(null, await getDevUser((req as unknown) as Request));
  })
);

passport.serializeUser(function (user: any, done) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});
