import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { ContentObject } from './ContentObject';
import { User } from './User';

@Table({
  comment: 'Участие в событиях',
  schema: DB_SCHEMA,
})
export class EventParticipation extends Model<EventParticipation> {
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => ContentObject)
  contentObject: ContentObject;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @ForeignKey(() => ContentObject)
  @Column
  contentObjectId!: number;

  @Column
  updaterId?: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
