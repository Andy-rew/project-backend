import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  ForeignKey,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  BelongsToMany,
  BelongsTo,
  HasOne,
  HasMany,
  DeletedAt,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';

import { ContentLike } from './ContentLike';
import { ContentView } from './ContentView';
import { User } from './User';
import { EventParticipation } from './EventParticipation';
import { OrganizationContent } from './OrganizationContent';

export enum ContentType {
  news = 'news',
  event = 'event',
}
export enum ContentStatus {
  publicated = 'publicated',
  draft = 'draft',
}

@Table({
  comment: 'Новости и мероприятия',
  schema: DB_SCHEMA,
})
export class ContentObject extends Model<ContentObject> {
  @BelongsToMany(() => User, () => ContentView)
  viewers: User[];

  @BelongsToMany(() => User, () => ContentLike)
  likers: User[];

  @BelongsToMany(() => User, () => EventParticipation)
  members: User[];

  @HasMany(() => ContentView)
  contentViewLinks: ContentView[];

  @HasMany(() => ContentLike)
  contentLikeLinks: ContentLike[];

  @HasMany(() => EventParticipation)
  eventParticipationLinks: EventParticipation[];

  @HasOne(() => OrganizationContent)
  organizationContentLink: OrganizationContent;

  @BelongsTo(() => ContentObject)
  contentObject: ContentObject;

  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ContentType)))
  type!: ContentType;

  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull
  @Column(DataType.TEXT)
  shortDescription?: string;

  @AllowNull
  @Column(DataType.TEXT)
  fullDescription?: string;

  @AllowNull(false)
  @Default(ContentStatus.draft)
  @Column(DataType.ENUM(...Object.values(ContentStatus)))
  status!: ContentStatus;

  @AllowNull
  @Column(DataType.TEXT)
  avatarUrl?: string;

  @AllowNull
  @Column(DataType.DATE)
  eventDate?: Date;

  @AllowNull
  @ForeignKey(() => ContentObject)
  @Column(DataType.INTEGER)
  parentId?: number;

  @Column
  updaterId?: number;

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
