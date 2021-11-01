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
  comment: 'Информация о пройденных курсах',
  schema: DB_SCHEMA,
})
export class Course extends Model<Course> {
  @BelongsTo(() => User)
  user: User;

  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  completionDate!: Date;

  @AllowNull(false)
  @Column
  grade!: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
