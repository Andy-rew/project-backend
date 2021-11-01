import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  ForeignKey,
  BelongsTo,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';

import { User } from './User';

@Table({
  comment: 'Смена почты пользователя',
  schema: DB_SCHEMA,
})
export class EmailChange extends Model<EmailChange> {
  @BelongsTo(() => User)
  user: User;

  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @AllowNull
  @Column
  email?: string;

  @AllowNull
  @Column
  activationCode?: string;

  @AllowNull
  @Column(DataType.DATE)
  activationCodeStopDate?: Date;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
