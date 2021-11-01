import { Request } from 'polka';

import { toArray } from '../util/pagination';

import { User, UserRoles } from '../models/User';

export const getDevUser = async (req: Request): Promise<any> => {
  const email = 'test1@test.test';
  const roles = toArray(req.query.roles);

  let user = await User.findOne({ where: { email } });
  if (!user) {
    await User.create({
      surname: 'Иванов',
      name: 'Иван',
      midname: 'Иванович',
      roles: [UserRoles.admin],
      email,
    });
    user = await User.findOne({ where: { email } });
  }

  if (req.query.userId) {
    return actualUserAuth(req, user);
  }
  if (roles) {
    await user.update({ roles });
  }

  await user.reload();

  return user?.toJSON();
};

async function actualUserAuth(req: Request, actualUser: User) {
  const user = await User.findByPk(req.query.userId as string);
  if (!user) {
    return null;
  }
  user.setDataValue('actualUser', actualUser.toJSON() as User);
  return user?.toJSON();
}
