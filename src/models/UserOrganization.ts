import {
  Model,
  Column,
  Table,
  AllowNull,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { User } from './User';
import { Organization } from './Organization';

@Table({
  comment: 'Промежуточная таблица между пользователем и организацией',
  timestamps: false,
  schema: DB_SCHEMA,
})
export class UserOrganization extends Model<UserOrganization> {
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Organization)
  organization: Organization;

  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @PrimaryKey
  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column
  organizationId: number;
}
