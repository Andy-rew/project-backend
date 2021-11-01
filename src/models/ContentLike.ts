import {
  Model,
  Column,
  Table,
  BelongsTo,
  AllowNull,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { User } from './User';
import { ContentObject } from './ContentObject';

@Table({
  comment: 'Лайк-объект для лайка/дизлайка новости или события',
  schema: DB_SCHEMA,
})
export class ContentLike extends Model<ContentLike> {
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
  organizationId: number;

  @AllowNull(false)
  @Column
  likeToggle!: boolean;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
