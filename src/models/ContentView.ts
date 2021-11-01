import {
  Model,
  Column,
  Table,
  BelongsTo,
  PrimaryKey,
  ForeignKey,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';

import { User } from './User';
import { ContentObject } from './ContentObject';

@Table({
  comment: 'Просмотры новости или события',
  schema: DB_SCHEMA,
})
export class ContentView extends Model<ContentView> {
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => ContentObject)
  contentObject: ContentObject;

  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @PrimaryKey
  @ForeignKey(() => ContentObject)
  @AllowNull(false)
  @Column
  contentObjectId: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
