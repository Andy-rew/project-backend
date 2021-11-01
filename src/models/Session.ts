import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';

import { User } from './User';

@Table({ comment: 'Сессия', schema: DB_SCHEMA })
export class Session extends Model<Session> {
  passportUser: any;

  @BelongsTo(() => User)
  user: User;

  @PrimaryKey
  @Column
  sid: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column(DataType.DATE)
  expires: Date;

  @Column(DataType.TEXT)
  data: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
