import {
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  HasMany,
  DataType,
  BelongsToMany,
  PrimaryKey,
  AutoIncrement,
  DeletedAt,
  Table,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { ContentObject } from './ContentObject';
import { OrganizationContent } from './OrganizationContent';
import { User } from './User';
import { UserOrganization } from './UserOrganization';

export enum OrganizationType {
  school = 'Школа',
  other = 'Другое',
  college = 'СПО',
}

@Table({
  comment: 'Организация',
  schema: DB_SCHEMA,
})
export class Organization extends Model<Organization> {
  @BelongsToMany(() => User, () => UserOrganization)
  users: User[];

  @BelongsToMany(() => ContentObject, () => OrganizationContent)
  contentObjects: ContentObject[];

  @HasMany(() => UserOrganization)
  usersLinks: UserOrganization[];

  @HasMany(() => OrganizationContent)
  organizationContentLinks: OrganizationContent[];

  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.ENUM(...Object.values(OrganizationType))))
  type!: OrganizationType[];

  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull
  @Column(DataType.TEXT)
  shortDescription?: string;

  @AllowNull
  @Column(DataType.TEXT)
  fullDescription?: string;

  @AllowNull
  @Column(DataType.STRING(2048))
  avatarUrl?: string;

  @AllowNull
  @Column
  address?: string;

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
