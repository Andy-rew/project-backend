
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  DeletedAt,
  IsEmail,
  Model, PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';

@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt', 'deletedAt'],
  },
}))
@Table({ comment: 'Пользователи', schema: DB_SCHEMA })
export class User extends Model<User> {

  @PrimaryKey
  @Column
  personalId!: number;

  @Column
  name!: string;

  @Column
  surname!: string;

  @Column
  midname?: string;

  @Column
  address?: string;

  @Column
  records?: number;

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
