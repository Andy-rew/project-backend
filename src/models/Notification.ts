import {
  Model,
  Column,
  Table,
  AutoIncrement,
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
  comment: 'Уведомления',
  schema: DB_SCHEMA,
})
export class Notification extends Model<Notification> {
  @BelongsTo(() => User)
  user: User;

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  text!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
