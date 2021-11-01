import _ from 'lodash';
import moment from 'moment';
import {
  AllowNull,
  Column,
  Comment,
  CreatedAt,
  DataType,
  Default,
  DefaultScope,
  DeletedAt,
  HasOne,
  HasMany,
  BelongsToMany,
  IsEmail,
  Model,
  Scopes,
  ScopesOptionsGetter,
  Table,
  ForeignKey,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Transaction, Transactionable } from 'sequelize';

import { DB_SCHEMA } from '../util/secrets';

import { UserPassword } from './UserPassword';
import { Session } from './Session';
import { EmailChange } from './EmailChange';
import { Course } from './Course';
import { Notification } from './Notification';

import { UserOrganization } from './UserOrganization';
import { Organization } from './Organization';

import { ContentObject } from './ContentObject';
import { ContentLike } from './ContentLike';
import { ContentView } from './ContentView';
import { EventParticipation } from './EventParticipation';
export enum UserRoles {
  teacher = 'teacher',
  student = 'student',
  admin = 'admin',
  curator = 'curator',
  contentmanager = 'contentmanager',
}

const UserScopes: ScopesOptionsGetter = () => ({
  small: () => ({
    attributes: ['id', 'name', 'surname', 'midname', 'initials'],
  }),
});

@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt', 'deletedAt'],
  },
}))
@Scopes(UserScopes)
@Table({ comment: 'Пользователи', schema: DB_SCHEMA })
export class User extends Model<User> {
  actualUser?: User;

  public static async reloadSession(
    userId: number,
    options?: Transactionable
  ): Promise<void> {
    if (!options?.transaction) {
      const sequelize = User.sequelize;
      await sequelize.transaction(async (t: Transaction) => {
        await User.reloadSession(userId, { transaction: t });
      });
      return;
    }
    const t = options.transaction;
    const [user, sessions] = await Promise.all([
      User.findByPk(userId, { transaction: t }),
      Session.findAll({ where: { userId }, transaction: t }),
    ]);
    const userObj = user.toJSON();
    for (const session of sessions) {
      const data = JSON.parse(session.data);
      if (
        _.isNil(data.passport?.user) ||
        moment(session.expires).isBefore(moment())
      ) {
        continue;
      }
      const newData = data;
      newData.passport.user = userObj;
      if (data.passport.user.actualUser) {
        newData.passport.user.actualUser = data.passport.user.actualUser;
      }
      await session.update(
        { data: JSON.stringify(newData) },
        { transaction: t }
      );
    }
  }

  @BelongsToMany(() => Organization, () => UserOrganization)
  organizations: Organization[];

  @BelongsToMany(() => ContentObject, () => ContentLike)
  contentLikes: ContentObject[];

  @BelongsToMany(() => ContentObject, () => ContentView)
  contentViews: ContentObject[];

  @BelongsToMany(() => ContentObject, () => EventParticipation)
  eventParticipations: ContentObject[];

  @HasMany(() => Course)
  courses: Course[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @HasMany(() => UserOrganization)
  organizationLinks: UserOrganization[];

  @HasMany(() => ContentLike)
  contentLikeLinks: ContentLike[];

  @HasMany(() => ContentView)
  contentViewLinks: ContentView[];

  @HasMany(() => EventParticipation)
  eventParticipationLinks: EventParticipation[];

  @HasOne(() => UserPassword)
  passwordData: UserPassword;

  @HasOne(() => EmailChange)
  emailData: EmailChange;

  @AllowNull(false)
  @Column
  surname!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @Column
  midname?: string;

  @Column(DataType.VIRTUAL)
  get initials(): string {
    return `${this.surname} ${this.name[0]}.${
      this.midname ? this.midname[0] + '.' : ''
    }`;
  }

  @Column(DataType.VIRTUAL)
  get nameMidname(): string {
    return `${this.name}${this.midname ? ' ' + this.midname : ''}`;
  }

  @AllowNull(false)
  @Unique
  @IsEmail
  @Column
  email?: string;

  @Column
  phone?: string;

  @Column(DataType.DATE)
  birthday?: Date;

  @Column(DataType.TEXT)
  about?: string;

  @Column(DataType.STRING(2048))
  avatarUrl?: string;

  @Column
  vkId?: string;

  @Column
  moodleUserId?: string;

  @Comment('Роли')
  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.ENUM(...Object.values(UserRoles))))
  roles!: UserRoles[];

  @AllowNull(false)
  @Default(true)
  @Column
  getNotif!: boolean;

  @AllowNull(false)
  @Default(true)
  @Column
  getNews!: boolean;

  @AllowNull(false)
  @Default(true)
  @Column
  getEvents!: boolean;

  @ForeignKey(() => User)
  @AllowNull
  @Column
  updaterId?: number;

  @AllowNull(false)
  @Default(true)
  @Column
  isActivated!: boolean;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt?: Date;
}
