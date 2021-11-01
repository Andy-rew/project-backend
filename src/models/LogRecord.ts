import {
  Model,
  Column,
  Table,
  CreatedAt,
  AllowNull,
  BelongsTo,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';

import { User } from '../models/User';

@Table({ comment: 'Логи клиента', schema: DB_SCHEMA })
export class LogRecord extends Model<LogRecord> {
  @BelongsTo(() => User, { onDelete: 'cascade', foreignKey: 'fakeUserId' })
  fakeUser: User;

  @BelongsTo(() => User, { onDelete: 'cascade', foreignKey: 'userId' })
  user: User;

  @AllowNull(false)
  @Column(DataType.ENUM('critical', 'error', 'warning', 'info', 'debug'))
  severity: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  message: any;

  @AllowNull(false)
  @Column
  timestamp: Date;

  @Column
  page: string;

  @Column(DataType.JSONB)
  error: any;

  @AllowNull
  @ForeignKey(() => User)
  @Column
  fakeUserId: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number;

  @CreatedAt
  createdAt: Date;
}
